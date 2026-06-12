const BaseService = require('./base.service');
const CouponRepository = require('../repositories/coupon.repository');
const ApiError = require('../utils/ApiError');

class CouponService extends BaseService {
    constructor() {
        super(new CouponRepository());
    }

    async create(data) {
        const exists = await this.repository.findByCode(data.code);
        if (exists) throw ApiError.conflict('Coupon code already exists');
        return this.repository.create(data);
    }

    async getAll(filters = {}, options = {}) {
        const query = {};
        if (filters.isActive !== undefined) query.isActive = filters.isActive;
        if (filters.search) query.code = { $regex: filters.search, $options: 'i' };
        const [coupons, total] = await Promise.all([
            this.repository.find(query, options),
            this.repository.count(query)
        ]);
        return { coupons, total };
    }

    async validate(code, subtotal, userId) {
        const coupon = await this.repository.findValidByCode(code);
        if (!coupon) throw ApiError.badRequest('Invalid or expired coupon');
        if (subtotal < coupon.minOrderAmount) {
            throw ApiError.badRequest(`Minimum order ৳${coupon.minOrderAmount} required`);
        }
        // Check per-user usage
        const userUsedCount = coupon.usedBy.filter(id => id.toString() === userId.toString()).length;
        if (userUsedCount >= coupon.maxUsagePerUser) {
            throw ApiError.badRequest('You have already used this coupon');
        }
        return coupon;
    }
}

module.exports = CouponService;
