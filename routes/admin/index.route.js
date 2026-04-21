const Router= require('express').Router();


Router.use('/city',require('./city.route'));
Router.use('/brand',require('./brand.route'));
Router.use('/category',require('./category.route'));
Router.use('/subcategory',require('./subcategory.route'));


module.exports= Router;