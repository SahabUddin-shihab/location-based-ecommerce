const router = require('express').Router();


router.use('/cart',     require('./cart.route'));

module.exports = router;
