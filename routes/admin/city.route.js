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
    '/',
    validate(createCitySchema),
    CityController.store
);


router.put(
    '/:id',
    validate(updateCitySchema),
    CityController.update
)

// router.patch(
//     '/status-update/:id',
//     validate(getCitySchema),
//     cityController.statusUpdate
// )

router.delete(
    '/:id',
    validate(deleteCitySchema),
    CityController.delete
)

module.exports= router