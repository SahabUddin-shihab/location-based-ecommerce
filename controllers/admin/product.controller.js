const ProductService = require('../../services/product.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AdminProductController {
    constructor() {
        this.productService = new ProductService();
    }

    index = catchAsync(async (req, res) => {
        const { page = 1, limit = 20, keyword, category, brand, isActive, isFeatured } = req.query;
        const filters = { keyword, category, brand };
        if (isActive !== undefined) filters.isActive = isActive === 'true';
        if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';


        const ProductRepository = require('../../repositories/product.repository');
        const repo = new ProductRepository();
        const query = {};
        if (keyword) query.$text = { $search: keyword };
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [products, total] = await Promise.all([
            repo.find(query, {
                limit: parseInt(limit), skip,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'category', select: 'name' },
                    { path: 'brand', select: 'name' }
                ]
            }),
            repo.count(query)
        ]);
        return ApiResponse.paginated(res, products, page, limit, total, 'Products fetched');
    });

    store = catchAsync(async (req, res) => {
        if (req.files?.thumbnail?.[0]) {
            req.body.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
        }
        if (req.files?.images) {
            req.body.images = req.files.images.map((f, i) => ({
                url: `/uploads/products/${f.filename}`,
                alt: req.body.name || '',
                order: i
            }));
        }
        req.body.createdBy = req.admin._id;
        const product = await this.productService.create(req.body);
        return ApiResponse.success(res, product, 'Product created', 201);
    });

    edit = catchAsync(async (req, res) => {
        const product = await this.productService.getById(req.params.id);
        return ApiResponse.success(res, product, 'Product fetched');
    });

    update = catchAsync(async (req, res) => {
        if (req.files?.thumbnail?.[0]) {
            req.body.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
        }
        if (req.files?.images) {
            req.body.images = req.files.images.map((f, i) => ({
                url: `/uploads/products/${f.filename}`,
                alt: req.body.name || '',
                order: i
            }));
        }
        const product = await this.productService.update(req.params.id, req.body);
        return ApiResponse.success(res, product, 'Product updated');
    });

    delete = catchAsync(async (req, res) => {
        await this.productService.delete(req.params.id);
        return ApiResponse.success(res, null, 'Product deleted');
    });

    pendingReviews = catchAsync(async (req, res) => {
        const reviews = await this.productService.getPendingReviews();
        return ApiResponse.success(res, reviews, 'Pending reviews');
    });

    approveReview = catchAsync(async (req, res) => {
        const product = await this.productService.approveReview(req.params.id, req.params.reviewId);
        return ApiResponse.success(res, product, 'Review approved');
    });
}

module.exports = new AdminProductController();
