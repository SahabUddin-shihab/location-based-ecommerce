const router = require('express').Router();
const CartController = require('../../controllers/user/cart.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate');
const {
    addToCartSchema,
    updateCartItemSchema,
    removeCartItemSchema,
    applyCouponSchema,
} = require('../../validations/cart.validation');

router.use(protect);

router.get('/',                                                    CartController.index);
router.get('/checkout-summary',                                    CartController.checkoutSummary);
router.post('/items',           validate(addToCartSchema),         CartController.addItem);
router.put('/items/:itemId',    validate(updateCartItemSchema),    CartController.updateItem);
router.delete('/items/:itemId', validate(removeCartItemSchema),    CartController.removeItem);
router.delete('/',                                                 CartController.clearCart);
router.post('/coupon',          validate(applyCouponSchema),       CartController.applyCoupon);
router.delete('/coupon',                                           CartController.removeCoupon);

module.exports = router;
