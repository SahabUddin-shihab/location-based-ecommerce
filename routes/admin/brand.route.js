const router= require('express').Router();
const BrandController= require('../../controllers/admin/brand.controller');
const validate= require('../../middleware/validate');
const  {
    createBrandSchema,
    updateBrandSchema,
    getBrandSchema,
    deleteBrandSchema
    }= require('../../validations/brand.validation');


router.get(
    '/',
    BrandController.index
);
router.post(
    '/',
    validate(createBrandSchema),
    BrandController.store
);

router.get(
    '/:id',
    validate(getBrandSchema),
    BrandController.edit
)


router.put(
    '/:id',
    validate(updateBrandSchema),
    BrandController.update
)

// router.patch(
//     '/status-update/:id',
//     validate(getCitySchema),
//     cityController.statusUpdate
// )

router.delete(
    '/:id',
    validate(deleteBrandSchema),
    BrandController.delete
)

module.exports= router