const router = require('express').Router();
const OrderController = require('../../controllers/user/order.controller');
const ReturnController = require('../../controllers/user/return.controller');
const { protect } = require('../../middleware/auth.middleware');
const { orderLimiter } = require('../../middleware/rateLimiter');
const validate = require('../../middleware/validate');
const {
    placeOrderSchema,
    getOrderSchema,
    cancelOrderSchema,
} = require('../../validations/order.validation');
const { z } = require('zod');
const { objectId } = require('../../validations/shared');

router.use(protect);

router.post('/',              orderLimiter, validate(placeOrderSchema),  OrderController.placeOrder);
router.get('/',                                                           OrderController.myOrders);
router.get('/:id',            validate(getOrderSchema),                  OrderController.show);
router.patch('/:id/cancel',   validate(cancelOrderSchema),               OrderController.cancel);

// Returns
const returnSchema = z.object({
    params: z.object({ orderId: objectId }),
    body: z.object({
        reason:      z.string().trim().min(5, 'Reason too short').max(500),
        description: z.string().trim().optional(),
    }),
});
router.post('/:orderId/return', validate(returnSchema), ReturnController.create);
router.get('/returns/my',                               ReturnController.myReturns);

module.exports = router;
