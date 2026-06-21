const ProductService = require('../../services/product.service');
const UserService = require('../../services/user.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.userService = new UserService();
    }

    index = catchAsync(async (req, res) => {
        const { page = 1, limit = 20, sort, keyword, category, subcategory, brand, minPrice, maxPrice, rating, inStock } = req.query;

        const sortMap = {
            newest: { createdAt: -1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating: { averageRating: -1 },
            popular: { soldCount: -1 },
        };

        const filters = { keyword, category, subcategory, brand, minPrice, maxPrice, minRating: rating, inStock };
        const options = {
            sort: sortMap[sort] || { createdAt: -1 },
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };

        const { products, total } = await this.productService.search(filters, options);
        return ApiResponse.paginated(res, products, page, limit, total);
    });

    show = catchAsync(async (req, res) => {
        const product = await this.productService.getBySlug(req.params.slug);

        this.productService.trackView(product._id).catch(() => {});
        if (req.user) {
            this.userService.addToRecentlyViewed(req.user._id, product._id).catch(() => {});
        }

        return ApiResponse.success(res, product, 'Product fetched');
    });

    featured = catchAsync(async (req, res) => {
        const products = await this.productService.getFeatured();
        return ApiResponse.success(res, products, 'Featured products');
    });

    newArrivals = catchAsync(async (req, res) => {
        const products = await this.productService.getNewArrivals();
        return ApiResponse.success(res, products, 'New arrivals');
    });

    bestSellers = catchAsync(async (req, res) => {
        const products = await this.productService.getBestSellers();
        return ApiResponse.success(res, products, 'Best sellers');
    });

    addReview = catchAsync(async (req, res) => {
        const product = await this.productService.addReview(req.params.id, req.user._id, req.body);
        return ApiResponse.success(res, product, 'Review submitted. Pending approval.', 201);
    });
}

module.exports = new ProductController();
