const Router= require('express').Router();

Router.use('/auth',      require('./auth.route'));
Router.use('/city',require('./city.route'));
Router.use('/brand',require('./brand.route'));
Router.use('/category',require('./category.route'));
Router.use('/subcategory',require('./subcategory.route'));



Router.use('/products',  require('./product.route'));
Router.use('/banners',   require('./banner.route'));
Router.use('/coupons',   require('./coupon.route'));


module.exports= Router;