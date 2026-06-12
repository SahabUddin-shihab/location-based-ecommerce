const router = require('express').Router();
const AdminCouponController = require('../../controllers/admin/coupon.controller');
const { adminProtect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate');
const {
    createCouponSchema,
    updateCouponSchema,
    getCouponSchema,
    deleteCouponSchema,
} = require('../../validations/coupon.validation');

router.use(adminProtect);

router.get('/',      AdminCouponController.index);
router.post('/',     validate(createCouponSchema), AdminCouponController.store);
router.get('/:id',   validate(getCouponSchema),    AdminCouponController.edit);
router.put('/:id',   validate(updateCouponSchema), AdminCouponController.update);
router.delete('/:id',validate(deleteCouponSchema), AdminCouponController.delete);

module.exports = router;
