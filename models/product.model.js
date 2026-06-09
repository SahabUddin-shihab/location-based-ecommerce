const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, 
    options: [{
        value: { type: String, required: true, trim: true },
        sku: { type: String, trim: true },
        price: { type: Number, min: 0 },
        salePrice: { type: Number, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
        image: String,
    }]
}, { _id: false });

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxLength: 100 },
    comment: { type: String, trim: true, maxLength: 1000 },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const seoSchema = new mongoose.Schema({
    metaTitle: { type: String, maxLength: 70 },
    metaDescription: { type: String, maxLength: 160 },
    metaKeywords: [String],
    ogImage: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [200, 'Product name too long']
    },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, required: [true, 'Description required'], trim: true },
    shortDescription: { type: String, trim: true, maxLength: 500 },


    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    tags: [{ type: String, trim: true, lowercase: true }],

    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0, default: null },
    saleStartDate: Date,
    saleEndDate: Date,
    costPrice: { type: Number, min: 0 },

    taxClass: { type: String, enum: ['standard', 'reduced', 'zero', 'none'], default: 'standard' },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    weight: { type: Number, min: 0 },    // grams
    dimensions: {
        length: Number, width: Number, height: Number  // cm
    },
    isFreeShipping: { type: Boolean, default: false },

    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    manageStock: { type: Boolean, default: true },
    stockStatus: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'backorder'],
        default: 'in_stock'
    },

    thumbnail: { type: String, default: null },
    images: [{ url: String, alt: String, order: { type: Number, default: 0 } }],

    hasVariants: { type: Boolean, default: false },
    variants: [variantSchema],
    attributes: [{ key: String, value: String }],

    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDigital: { type: Boolean, default: false },


    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    seo: seoSchema,

    viewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

productSchema.pre('save', function (next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
    }
    if (this.isModified('stock') && this.manageStock) {
        if (this.stock <= 0) this.stockStatus = 'out_of_stock';
        else this.stockStatus = 'in_stock';
    }
    if (this.isModified('reviews')) {
        const approved = this.reviews.filter(r => r.isApproved);
        this.reviewCount = approved.length;
        this.averageRating = approved.length
            ? approved.reduce((s, r) => s + r.rating, 0) / approved.length
            : 0;
    }
    next();
});

productSchema.virtual('effectivePrice').get(function () {
    const now = new Date();
    if (this.salePrice &&
        (!this.saleStartDate || this.saleStartDate <= now) &&
        (!this.saleEndDate || this.saleEndDate >= now)) {
        return this.salePrice;
    }
    return this.price;
});

productSchema.virtual('discountPercent').get(function () {
    if (this.salePrice && this.salePrice < this.price) {
        return Math.round(((this.price - this.salePrice) / this.price) * 100);
    }
    return 0;
});

module.exports = mongoose.model('Product', productSchema);
