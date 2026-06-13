const ReturnRequest = require('../models/return.model');
const OrderRepository = require('../repositories/order.repository');
const ApiError = require('../utils/ApiError');

class ReturnService {
    constructor() {
        this.orderRepo = new OrderRepository();
    }

    async create(userId, orderId, data) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw ApiError.notFound('Order not found');
        if (order.user?.toString() !== userId.toString()) throw ApiError.forbidden('Access denied');
        if (order.status !== 'delivered') throw ApiError.badRequest('Only delivered orders can be returned');


        const existing = await ReturnRequest.findOne({ order: orderId, user: userId, status: { $in: ['pending', 'approved'] } });
        if (existing) throw ApiError.conflict('A return request for this order already exists');

        const returnReq = await ReturnRequest.create({ order: orderId, user: userId, ...data });


        await this.orderRepo.updateById(orderId, {
            status: 'return_requested',
            returnReason: data.reason,
            $push: { statusHistory: { status: 'return_requested', changedByRole: 'user', changedAt: new Date() } },
        });

        return returnReq;
    }

    async getUserReturns(userId) {
        return ReturnRequest.find({ user: userId })
            .populate('order', 'orderNumber total status')
            .populate('items.product', 'name thumbnail')
            .sort({ createdAt: -1 });
    }

    async getAll(filters = {}, options = {}) {
        const query = {};
        if (filters.status) query.status = filters.status;
        const { page = 1, limit = 20 } = options;
        const skip = (page - 1) * limit;

        const [returns, total] = await Promise.all([
            ReturnRequest.find(query)
                .populate('order', 'orderNumber total')
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ReturnRequest.countDocuments(query),
        ]);
        return { returns, total };
    }

    async process(returnId, adminId, { status, refundAmount, adminNote }) {
        const returnReq = await ReturnRequest.findById(returnId);
        if (!returnReq) throw ApiError.notFound('Return request not found');
        if (!['pending'].includes(returnReq.status)) throw ApiError.badRequest('Request already processed');

        returnReq.status = status;
        returnReq.refundAmount = refundAmount || 0;
        returnReq.adminNote = adminNote;
        returnReq.processedBy = adminId;
        returnReq.processedAt = new Date();
        await returnReq.save();
        

        const orderStatus = status === 'approved' ? 'returned' : 'delivered';
        await this.orderRepo.updateById(returnReq.order, {
            status: orderStatus,
            $push: { statusHistory: { status: orderStatus, changedBy: adminId, changedByRole: 'admin', changedAt: new Date() } },
        });

        return returnReq;
    }
}

module.exports = ReturnService;
