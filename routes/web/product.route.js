const router = require('express').Router();
const ProductController = require('../../controllers/web/product.controller');
const { protect, optionalAuth } = require('../../middleware/auth.middleware');
const { searchLimiter } = require('../../middleware/rateLimiter');
const validate = require('../../middleware/validate');
const {
    searchProductsSchema,
    productSlugSchema,
    addReviewSchema,
} = require('../../validations/product.validation');


router.get('/',               searchLimiter, validate(searchProductsSchema), optionalAuth, ProductController.index);
router.get('/featured',       ProductController.featured);
router.get('/new-arrivals',   ProductController.newArrivals);
router.get('/best-sellers',   ProductController.bestSellers);
router.get('/:slug',          validate(productSlugSchema), optionalAuth, ProductController.show);


router.post('/:id/reviews',   protect, validate(addReviewSchema), ProductController.addReview);

module.exports = router;
