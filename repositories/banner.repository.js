const Banner = require('../models/banner.model');
const BaseRepository = require('./base.repository');

class BannerRepository extends BaseRepository {
    constructor() {
        super(Banner);
    }

    async findActiveByPosition(position) {
        const now = new Date();
        return this.model.find({
            position,
            isActive: true,
            $or: [
                { startDate: null },
                { startDate: { $lte: now } }
            ],
            $or: [
                { endDate: null },
                { endDate: { $gte: now } }
            ]
        }).sort({ order: 1 });
    }
}

module.exports = BannerRepository;
