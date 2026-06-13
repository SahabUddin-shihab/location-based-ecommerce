const CartRepository = require('../repositories/cart.repository');
const ProductRepository = require('../repositories/product.repository');
const CouponRepository = require('../repositories/coupon.repository');
const ApiError = require('../utils/ApiError');

class CartService {
    constructor() {
        this.cartRepo = new CartRepository();
        this.productRepo = new ProductRepository();
        this.couponRepo = new CouponRepository();
    }

    async getCart(userId) {
        let cart = await this.cartRepo.findByUser(userId);
        if (!cart) return { items: [], subtotal: 0, itemCount: 0 };
        return cart;
    }

    async addItem(userId, productId, quantity = 1, variant = null) {
        const product = await this.productRepo.findById(productId);
        if (!product) throw ApiError.notFound('Product not found');
        if (!product.isActive) throw ApiError.badRequest('Product is not available');
        if (product.manageStock && product.stock < quantity) {
            throw ApiError.badRequest(`Only ${product.stock} items available`);
        }

        let cart = await this.cartRepo.findByUser(userId);
        if (!cart) {
            cart = await this.cartRepo.create({ user: userId, items: [] });
        }

        // Check if already in cart
        const existingIdx = cart.items.findIndex(item => {
            const sameProduct = item.product.toString() === productId.toString();
            const sameVariant = !variant || (item.variant?.name === variant?.name && item.variant?.value === variant?.value);
            return sameProduct && sameVariant;
        });

        if (existingIdx > -1) {
            const newQty = cart.items[existingIdx].quantity + quantity;
            if (product.manageStock && product.stock < newQty) {
                throw ApiError.badRequest(`Only ${product.stock} items in stock`);
            }
            cart.items[existingIdx].quantity = newQty;
        } else {
            cart.items.push({
                product: productId,
                variant,
                quantity,
                price: product.price,
                salePrice: product.effectivePrice < product.price ? product.effectivePrice : null,
            });
        }

        await cart.save();
        return this.cartRepo.findByUser(userId);
    }

    async updateItem(userId, itemId, quantity) {
        const cart = await this.cartRepo.findByUser(userId);
        if (!cart) throw ApiError.notFound('Cart not found');

        const item = cart.items.id(itemId);
        if (!item) throw ApiError.notFound('Cart item not found');

        const product = await this.productRepo.findById(item.product);
        if (product.manageStock && product.stock < quantity) {
            throw ApiError.badRequest(`Only ${product.stock} items available`);
        }

        item.quantity = quantity;
        await cart.save();
        return this.cartRepo.findByUser(userId);
    }

    async removeItem(userId, itemId) {
        const cart = await this.cartRepo.findByUser(userId);
        if (!cart) throw ApiError.notFound('Cart not found');

        cart.items = cart.items.filter(i => i._id.toString() !== itemId);
        await cart.save();
        return this.cartRepo.findByUser(userId);
    }

    async clearCart(userId) {
        return this.cartRepo.clearCart(userId);
    }

    async applyCoupon(userId, code) {
        const cart = await this.cartRepo.findByUser(userId);
        if (!cart || !cart.items.length) throw ApiError.badRequest('Cart is empty');

        const coupon = await this.couponRepo.findValidByCode(code);
        if (!coupon) throw ApiError.badRequest('Invalid or expired coupon');

        const subtotal = cart.subtotal;
        if (subtotal < coupon.minOrderAmount) {
            throw ApiError.badRequest(`Minimum order amount is ৳${coupon.minOrderAmount}`);
        }

        let discountAmount = 0;
        if (coupon.discountType === 'flat') {
            discountAmount = Math.min(coupon.discountValue, subtotal);
        } else {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }

        cart.coupon = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: Math.round(discountAmount * 100) / 100,
        };
        await cart.save();
        return cart;
    }

    async removeCoupon(userId) {
        const cart = await this.cartRepo.findByUser(userId);
        if (!cart) throw ApiError.notFound('Cart not found');
        cart.coupon = null;
        await cart.save();
        return cart;
    }

    // Calculate full checkout summary
    async getCheckoutSummary(userId, shippingZone = null) {
        const cart = await this.cartRepo.findByUser(userId);
        if (!cart || !cart.items.length) throw ApiError.badRequest('Cart is empty');

        const subtotal = cart.subtotal;
        const discount = cart.coupon?.discountAmount || 0;
        const shippingCharge = this._calculateShipping(subtotal, shippingZone);
        const taxableAmount = subtotal - discount;
        const tax = Math.round(taxableAmount * 0 * 100) / 100; // 0% default; adjust as needed
        const total = Math.max(0, subtotal - discount + shippingCharge + tax);

        return {
            items: cart.items,
            subtotal,
            discount,
            shippingCharge,
            tax,
            total,
            coupon: cart.coupon,
            itemCount: cart.itemCount,
        };
    }

    _calculateShipping(subtotal, zone = null) {
        if (subtotal >= 1000) return 0; // free shipping above ৳1000
        if (zone === 'dhaka') return 60;
        if (zone === 'outside_dhaka') return 120;
        return 60; // default
    }
}

module.exports = CartService;
