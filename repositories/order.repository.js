const Order = require('../models/order.model');
const BaseRepository = require('./base.repository');

class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }

    async findByUser(userId, options = {}) {
        const { limit = 10, skip = 0, status } = options;
        const filter = { user: userId };
        if (status) filter.status = status;
        return this.model.find(filter)
            .select('orderNumber status total paymentMethod paymentStatus createdAt items')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async findByOrderNumber(orderNumber) {
        return this.model.findOne({ orderNumber })
            .populate('items.product', 'name slug thumbnail')
            .populate('user', 'name email phone');
    }

    async countByUser(userId) {
        return this.model.countDocuments({ user: userId });
    }

    async getAdminStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        const [totalRevenue, monthRevenue, todayRevenue, statusCounts] = await Promise.all([
            this.model.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            this.model.aggregate([
                { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            this.model.aggregate([
                { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfToday } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            this.model.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        return {
            totalRevenue: totalRevenue[0]?.total || 0,
            monthRevenue: monthRevenue[0]?.total || 0,
            todayRevenue: todayRevenue[0]?.total || 0,
            statusCounts,
        };
    }

    async getSalesChart(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return this.model.aggregate([
            { $match: { paymentStatus: 'paid', createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
    }
}

module.exports = OrderRepository;
