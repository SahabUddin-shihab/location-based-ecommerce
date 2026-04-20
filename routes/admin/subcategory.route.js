const router= require('express').Router();
const validate= require('../../middleware/validate');
const SubcategoryController= require('../../controllers/admin/subcategory.controller')
const {
    createSubcategorySchema,
    updateSubcategorySchema,
    getSubcategorySchema,
    deleteSubcategorySchema
}= require('../../validations/subcategory.validation');

router.get(
    '/',
    SubcategoryController.index
);

router.post(
    '/',
    validate(createSubcategorySchema),
    SubcategoryController.store
);

router.get(
    '/:id',
    validate(getSubcategorySchema),
    SubcategoryController.edit
);

router.put(
    '/:id',
    validate(updateSubcategorySchema),
    SubcategoryController.update
);

router.delete(
    '/:id',
    validate(deleteSubcategorySchema),
    SubcategoryController.delete
)

module.exports= router