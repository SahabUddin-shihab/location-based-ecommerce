const router= require('express').Router();


router.use('/auth',require('./user/auth.route'));

router.use('/admin',require('./admin/index.route'));

router.use('/user',require('./user/index.route'));

router.use('/products',require('./web/product.route'));

module.exports= router;

