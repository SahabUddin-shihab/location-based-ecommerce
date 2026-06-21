const router = require('express').Router();
const BannerService = require('../../services/banner.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');
const { cache } = require('../../config/redis');
const CacheConfig = require('../../config/cache.config');

const bannerService = new BannerService();


router.get('/homepage', catchAsync(async (req, res) => {
    const cacheKey = CacheConfig.keys.homepage();
    const cached = await cache.get(cacheKey);
    if (cached) return ApiResponse.success(res, cached, 'Homepage data fetched');

    const ProductService = require('../../services/product.service');
    const CategoryService = require('../../services/category.service');

    const productService = new ProductService();
    const categoryService = new CategoryService();

    const [featured, newArrivals, bestSellers, categories, heroBanners] = await Promise.all([
        productService.getFeatured(),
        productService.getNewArrivals(),
        productService.getBestSellers(),
        cache.get(CacheConfig.keys.categoriesActive()) ||
            categoryService.getAll({ isActive: true }, { limit: 12, sort: { order: 1 } })
                .then(r => r.categories),
        bannerService.getActiveByPosition('hero'),
    ]);

    const data = { featured, newArrivals, bestSellers, categories, heroBanners };
    await cache.set(cacheKey, data, CacheConfig.HOMEPAGE);
    return ApiResponse.success(res, data, 'Homepage data fetched');
}));


router.get('/banners/:position', catchAsync(async (req, res) => {
    const { position } = req.params;
    const validPositions = ['hero', 'sidebar', 'mid_page', 'footer', 'popup'];
    if (!validPositions.includes(position)) {
        return ApiResponse.error(res, 'Invalid banner position', 400);
    }
    const banners = await bannerService.getActiveByPosition(position);
    return ApiResponse.success(res, banners, 'Banners fetched');
}));


router.post('/banners/:id/click', catchAsync(async (req, res) => {
    await bannerService.incrementClick(req.params.id);
    return ApiResponse.success(res, null, 'Click tracked');
}));

module.exports = router;
