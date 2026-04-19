const router= require('express').Router();
const validate= require('../../middleware/validate');
const SubcategoryController= require('../../controllers/admin/subcategory.controller')


router.get(
    '/',
    SubcategoryController.index
)