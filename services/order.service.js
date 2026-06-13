const OrderRepository = require('../repositories/order.repository');
const CartRepository = require('../repositories/cart.repository');
const ProductRepository = require('../repositories/product.repository');
const CouponRepository = require('../repositories/coupon.repository');
const CartService = require('./cart.service');
const EmailService = require('./email.service');
const ApiError = require('../utils/ApiError');

class OrderService {
    constructor() {
        this.orderRepo = new OrderRepository();
        this.cartRepo = new CartRepository();
        this.productRepo = new ProductRepository();
        this.couponRepo = new CouponRepository();
        this.cartService = new CartService();
        this.emailService = new EmailService();
    }

    async placeOrder(userId, orderData) {
        const cart = await this.cartRepo.findByUser(userId);
        if (!cart || !cart.items.length) throw ApiError.badRequest('Cart is empty');

        const { shippingAddress, billingAddress, paymentMethod, notes, shippingZone } = orderData;

        console.log('Cart data is:',cart);
        const items = [];
        for (const cartItem of cart.items) {
            const product = cartItem.product;
            console.log('Cart Information: ',product);
            if (!product.isActive) throw ApiError.badRequest(`${product.name} is no longer available`);
            if (product.manageStock && product.stock < cartItem.quantity) {
                throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
            }
            items.push({
                product: product._id,
                name: product.name,
                thumbnail: product.thumbnail,
                sku: product.sku,
                variant: cartItem.variant || 'N/A',
                quantity: cartItem.quantity,
                price: cartItem.salePrice ?? cartItem.price,
                totalPrice: (cartItem.salePrice ?? cartItem.price) * cartItem.quantity,
            });
        }

        const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
        const discount = cart.coupon?.discountAmount || 0;
        const shippingCharge = this.cartService._calculateShipping(subtotal, shippingZone);
        const tax = 0;
        const total = Math.max(0, subtotal - discount + shippingCharge + tax);

        const order = await this.orderRepo.create({
            user: userId,
            items,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            subtotal,
            shippingCharge,
            discount,
            tax,
            total,
            coupon: cart.coupon || undefined,
            paymentMethod,
            notes,
            statusHistory: [{ status: 'pending', changedByRole: 'user' }],
        });


        for (const item of items) {
            await this.productRepo.decrementStock(item.product, item.quantity);
        }

        if (cart.coupon?.code) {
            const coupon = await this.couponRepo.findByCode(cart.coupon.code);
            if (coupon) await this.couponRepo.markUsed(coupon._id, userId);
        }

        await this.cartService.clearCart(userId);

        const User = require('../models/user.model');
        User.findById(userId).then(user => {
            if (user) {
                this.emailService.sendOrderConfirmation(user.email, user.name, order).catch(() => {});
            }
        });

        return order;
    }

    async getUserOrders(userId, options = {}) {
        const { page = 1, limit = 10, status } = options;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.orderRepo.findByUser(userId, { limit: parseInt(limit), skip, status }),
            this.orderRepo.countByUser(userId),
        ]);
        return { orders, total };
    }

    async getOrderDetail(orderId, userId) {
        const order = await this.orderRepo.findById(orderId, [
            { path: 'items.product', select: 'name slug thumbnail' },
        ]);
        if (!order) throw ApiError.notFound('Order not found');
        if (userId && order.user?.toString() !== userId.toString()) {
            throw ApiError.forbidden('Access denied');
        }
        return order;
    }

    async cancelOrder(orderId, userId, reason) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        if (order.user?.toString() !== userId.toString()) throw ApiError.forbidden('Access denied');
        if (!['pending', 'confirmed'].includes(order.status)) {
            throw ApiError.badRequest('Order cannot be cancelled at this stage');
        }

        await this._updateStatus(orderId, 'cancelled', reason, userId, 'user');

        // Restore stock
        for (const item of order.items) {
            await this.productRepo.updateById(item.product, {
                $inc: { stock: item.quantity, soldCount: -item.quantity }
            });
        }

        return this.orderRepo.findById(orderId);
    }

    async updateOrderStatus(orderId, status, note, adminId) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        await this._updateStatus(orderId, status, note, adminId, 'admin');

        const User = require('../models/user.model');
        if (order.user) {
            User.findById(order.user).then(user => {
                if (user) {
                    this.emailService.sendOrderStatusUpdate(user.email, user.name, order.orderNumber, status, note).catch(() => {});
                }
            });
        }

        return this.orderRepo.findById(orderId);
    }

    async _updateStatus(orderId, status, note, changedBy, changedByRole) {
        return this.orderRepo.updateById(orderId, {
            status,
            cancelReason: status === 'cancelled' ? note : undefined,
            $push: {
                statusHistory: { status, note, changedBy, changedByRole, changedAt: new Date() }
            }
        });
    }

    async getAdminOrders(filters = {}, options = {}) {
        const query = {};
        if (filters.status) query.status = filters.status;
        if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
        if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
        if (filters.search) {
            query.$or = [
                { orderNumber: { $regex: filters.search, $options: 'i' } },
            ];
        }
        if (filters.fromDate || filters.toDate) {
            query.createdAt = {};
            if (filters.fromDate) query.createdAt.$gte = new Date(filters.fromDate);
            if (filters.toDate) query.createdAt.$lte = new Date(filters.toDate);
        }

        const { page = 1, limit = 20 } = options;
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            this.orderRepo.find(query, { limit: parseInt(limit), skip, sort: { createdAt: -1 } }),
            this.orderRepo.count(query)
        ]);

        return { orders, total };
    }

    async getDashboardStats() {
        const [orderStats, productCount, userCount] = await Promise.all([
            this.orderRepo.getAdminStats(),
            require('../models/product.model').countDocuments({ isActive: true }),
            require('../models/user.model').countDocuments({ isActive: true }),
        ]);
        return { ...orderStats, productCount, userCount };
    }

    async getSalesChart(days = 30) {
        return this.orderRepo.getSalesChart(days);
    }
}

module.exports = OrderService;
