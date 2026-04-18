const router= require('express').Router();


router.use('/admin',require('./admin/index.route'));

module.exports= router;

