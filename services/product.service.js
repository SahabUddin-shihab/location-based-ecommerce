const BaseService = require('./base.service');
const ProductRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');
const { cache } = require('../config/redis');
const CacheConfig = require('../config/cache.config');

class ProductService extends BaseService {
    constructor() {
        super(new ProductRepository());
    }

    async create(data) {
        const product = await this.repository.create(data);
        await cache.delPattern('products:*');
        await cache.delPattern('categories:*');
        return product;
    }

    async getBySlug(slug) {
        const cacheKey = CacheConfig.keys.productSlug(slug);
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const product = await this.repository.findBySlug(slug, [
            { path: 'category', select: 'name slug' },
            { path: 'subcategory', select: 'name slug' },
            { path: 'brand', select: 'name slug' },
            { path: 'reviews.user', select: 'name avatar' },
            { path: 'relatedProducts', select: 'name slug price salePrice thumbnail averageRating' },
        ]);
        if (!product) throw ApiError.notFound('Product not found');

        await cache.set(cacheKey, product, CacheConfig.PRODUCT_DETAIL);
        return product;
    }

    async getById(id) {
        const cacheKey = CacheConfig.keys.productDetail(id);
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const product = await this.repository.findById(id, [
            { path: 'category', select: 'name slug' },
            { path: 'brand', select: 'name slug' },
        ]);
        if (!product) throw ApiError.notFound('Product not found');

        await cache.set(cacheKey, product, CacheConfig.PRODUCT_DETAIL);
        return product;
    }

    async search(filters, options) {
        const cacheKey = CacheConfig.keys.searchResults(JSON.stringify({ filters, options }));
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const result = await this.repository.search(filters, options);
        await cache.set(cacheKey, result, CacheConfig.SEARCH);
        return result;
    }

    async getFeatured() {
        const cacheKey = CacheConfig.keys.featuredProducts();
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const products = await this.repository.findFeatured();
        await cache.set(cacheKey, products, CacheConfig.FEATURED_PRODUCTS);
        return products;
    }

    async getNewArrivals() {
        return this.repository.findNewArrivals();
    }

    async getBestSellers() {
        return this.repository.findBestSellers();
    }

    async update(id, data) {
        const product = await this.repository.updateById(id, data);
        if (!product) throw ApiError.notFound('Product not found');
        await cache.del(CacheConfig.keys.productDetail(id));
        await cache.del(CacheConfig.keys.productSlug(product.slug));
        await cache.delPattern('products:*');
        return product;
    }

    async delete(id) {
        const product = await this.repository.delete(id);
        if (!product) throw ApiError.notFound('Product not found');
        await cache.del(CacheConfig.keys.productDetail(id));
        await cache.delPattern('products:*');
        return product;
    }

    async addReview(productId, userId, reviewData) {
        const product = await this.repository.findById(productId);
        if (!product) throw ApiError.notFound('Product not found');

        const alreadyReviewed = product.reviews.some(
            r => r.user.toString() === userId.toString()
        );
        if (alreadyReviewed) throw ApiError.conflict('You have already reviewed this product');

        const review = { user: userId, ...reviewData };
        const updated = await this.repository.addReview(productId, review);

        await cache.del(CacheConfig.keys.productDetail(productId));
        await cache.del(CacheConfig.keys.productSlug(product.slug));

        return updated;
    }

    async approveReview(productId, reviewId) {
        const product = await this.repository.approveReview(productId, reviewId);
        if (!product) throw ApiError.notFound('Product or review not found');

        const approvedReviews = product.reviews.filter(r => r.isApproved);
        const avg = approvedReviews.length
            ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
            : 0;
        await this.repository.updateById(productId, {
            averageRating: Math.round(avg * 10) / 10,
            reviewCount: approvedReviews.length
        });

        await cache.del(CacheConfig.keys.productDetail(productId));
        return product;
    }

    async trackView(productId) {
        await this.repository.incrementView(productId);
        await cache.del(CacheConfig.keys.productDetail(productId));
    }

    async getPendingReviews() {
        return this.repository.aggregate([
            { $unwind: '$reviews' },
            { $match: { 'reviews.isApproved': false } },
            {
                $project: {
                    name: 1, slug: 1,
                    review: '$reviews'
                }
            }
        ]);
    }
}

module.exports = ProductService;
