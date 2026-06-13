const router = require('express').Router();


router.use('/', require('./user.route'));
router.use('/cart', require('./cart.route'));
router.use('/orders',   require('./order.route'));

module.exports = router;
