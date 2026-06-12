const Product = require('../models/product.model');
const BaseRepository = require('./base.repository');

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }

    async findBySlug(slug, populate = null) {
        let query = this.model.findOne({ slug, isActive: true });
        if (populate) query = query.populate(populate);
        return query;
    }

    async findFeatured(limit = 12) {
        return this.model.find({ isFeatured: true, isActive: true })
            .select('name slug price salePrice thumbnail averageRating reviewCount isFeatured stockStatus')
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async findNewArrivals(limit = 12) {
        return this.model.find({ isNewArrival: true, isActive: true })
            .select('name slug price salePrice thumbnail averageRating reviewCount stockStatus')
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async findBestSellers(limit = 12) {
        return this.model.find({ isActive: true })
            .select('name slug price salePrice thumbnail averageRating reviewCount soldCount')
            .sort({ soldCount: -1 })
            .limit(limit);
    }

    async search(filters = {}, options = {}) {
        const {
            keyword, category, subcategory, brand, tags,
            minPrice, maxPrice, minRating, inStock,
            isFeatured, isNewArrival
        } = filters;

        const query = { isActive: true };

        if (keyword) {
            query.$text = { $search: keyword };
        }
        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;
        if (brand) {
            query.brand = Array.isArray(brand) ? { $in: brand } : brand;
        }
        if (tags && tags.length) query.tags = { $in: tags };
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }
        if (minRating) query.averageRating = { $gte: Number(minRating) };
        if (inStock === true || inStock === 'true') query.stockStatus = 'in_stock';
        if (isFeatured) query.isFeatured = true;
        if (isNewArrival) query.isNewArrival = true;

        const {
            sort = { createdAt: -1 },
            limit = 20,
            skip = 0,
            select = 'name slug price salePrice thumbnail averageRating reviewCount stockStatus isFeatured brand category'
        } = options;

        const [products, total] = await Promise.all([
            this.model.find(query)
                .select(select)
                .populate('category', 'name slug')
                .populate('brand', 'name slug')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            this.model.countDocuments(query)
        ]);

        return { products, total };
    }

    async addReview(productId, review) {
        return this.model.findByIdAndUpdate(
            productId,
            { $push: { reviews: review } },
            { new: true }
        );
    }

    async approveReview(productId, reviewId) {
        return this.model.findOneAndUpdate(
            { _id: productId, 'reviews._id': reviewId },
            { $set: { 'reviews.$.isApproved': true } },
            { new: true }
        );
    }

    async incrementView(productId) {
        return this.model.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });
    }

    async decrementStock(productId, quantity) {
        return this.model.findByIdAndUpdate(
            productId,
            { $inc: { stock: -quantity, soldCount: quantity } },
            { new: true }
        );
    }
}

module.exports = ProductRepository;
