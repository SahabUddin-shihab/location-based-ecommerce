const router= require('express').Router();
const CityController= require('../../controllers/admin/city.controller');
const validate= require('../../middleware/validate');
const  {
    createCitySchema,
    updateCitySchema,
    getCitySchema,
    deleteCitySchema
    }= require('../../validations/city.validation');


router.get(
    '/',
    CityController.index
);
router.post(
    '/create',
    validate(createCitySchema),
    CityController.store
);

module.exports= router