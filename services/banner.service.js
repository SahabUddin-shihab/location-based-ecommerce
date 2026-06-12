const BaseService = require('./base.service');
const BannerRepository = require('../repositories/banner.repository');
const ApiError = require('../utils/ApiError');
const { cache } = require('../config/redis');

class BannerService extends BaseService {
    constructor() {
        super(new BannerRepository());
    }

    async create(data) {
        const banner = await this.repository.create(data);
        await cache.delPattern('banners:*');
        return banner;
    }

    async getAll(filters = {}, options = {}) {
        const query = {};
        if (filters.isActive !== undefined) query.isActive = filters.isActive;
        if (filters.position) query.position = filters.position;
        const [banners, total] = await Promise.all([
            this.repository.find(query, { ...options, sort: { order: 1 } }),
            this.repository.count(query),
        ]);
        return { banners, total };
    }

    async getActiveByPosition(position) {
        const cacheKey = `banners:${position}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const banners = await this.repository.findActiveByPosition(position);
        await cache.set(cacheKey, banners, 300);
        return banners;
    }

    async update(id, data) {
        const banner = await this.repository.updateById(id, data);
        if (!banner) throw ApiError.notFound('Banner not found');
        await cache.delPattern('banners:*');
        return banner;
    }

    async delete(id) {
        const banner = await this.repository.delete(id);
        if (!banner) throw ApiError.notFound('Banner not found');
        await cache.delPattern('banners:*');
        return banner;
    }

    async incrementClick(id) {
        return this.repository.updateById(id, { $inc: { clickCount: 1 } });
    }
}

module.exports = BannerService;
