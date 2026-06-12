const Coupon = require('../models/coupon.model');
const BaseRepository = require('./base.repository');

class CouponRepository extends BaseRepository {
    constructor() {
        super(Coupon);
    }

    async findByCode(code) {
        return this.model.findOne({ code: code.toUpperCase() });
    }

    async findValidByCode(code) {
        const now = new Date();
        return this.model.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
            $or: [{ maxUsage: null }, { $expr: { $lt: ['$usedCount', '$maxUsage'] } }]
        });
    }

    async markUsed(couponId, userId) {
        return this.model.findByIdAndUpdate(
            couponId,
            {
                $inc: { usedCount: 1 },
                $addToSet: { usedBy: userId }
            },
            { new: true }
        );
    }
}

module.exports = CouponRepository;
