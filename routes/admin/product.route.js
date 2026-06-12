const router = require('express').Router();
const AdminProductController = require('../../controllers/admin/product.controller');
const { adminProtect, adminRole } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate');
const { setUploadFolder } = require('../../middleware/upload.middleware');
const multer = require('multer');
const path = require('path');
const {
    createProductSchema,
    updateProductSchema,
    getProductSchema,
    deleteProductSchema,
    approveReviewSchema,
} = require('../../validations/product.validation');


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/products'),
    filename:    (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const productUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images',    maxCount: 10 },
]);


router.use(adminProtect);

router.get('/',                                               AdminProductController.index);
router.post('/',      productUpload, validate(createProductSchema), AdminProductController.store);
router.get('/reviews/pending',                                AdminProductController.pendingReviews);
router.get('/:id',    validate(getProductSchema),             AdminProductController.edit);
router.put('/:id',    productUpload, validate(updateProductSchema), AdminProductController.update);
router.delete('/:id', validate(deleteProductSchema),          AdminProductController.delete);
router.patch('/:id/reviews/:reviewId/approve', validate(approveReviewSchema), AdminProductController.approveReview);

module.exports = router;
