const router = require('express').Router();
const AdminBannerController = require('../../controllers/admin/banner.controller');
const { adminProtect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate');
const { uploadSingle, setUploadFolder } = require('../../middleware/upload.middleware');
const {
    createBannerSchema,
    updateBannerSchema,
    getBannerSchema,
    deleteBannerSchema,
} = require('../../validations/banner.validation');

router.use(adminProtect);

router.get('/',      AdminBannerController.index);
router.post('/',     setUploadFolder('banners'), uploadSingle('image'), validate(createBannerSchema), AdminBannerController.store);
router.get('/:id',   validate(getBannerSchema),  AdminBannerController.edit);
router.put('/:id',   setUploadFolder('banners'), uploadSingle('image'), validate(updateBannerSchema), AdminBannerController.update);
router.delete('/:id',validate(deleteBannerSchema), AdminBannerController.delete);

module.exports = router;
