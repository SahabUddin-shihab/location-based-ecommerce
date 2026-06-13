const router = require('express').Router();


router.use('/', require('./user.route'));
router.use('/cart', require('./cart.route'));

module.exports = router;
