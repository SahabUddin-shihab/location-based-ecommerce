const router= require('express').Router();
const CategoryController= require('../../controllers/admin/category.controller');
const validate= require('../../middleware/validate');

const {
    createCategorySchema,
    updateCategorySchema,
    getCategorySchema,
    deleteCategorySchema
}= require('../../validations/category.validation');


router.get(
    '/',
    CategoryController.index
);

router.post(
    '/',validate(createCategorySchema),
    CategoryController.store
)

router.get(
    '/:id',
    validate(getCategorySchema),
    CategoryController.edit
)

module.exports= router;
