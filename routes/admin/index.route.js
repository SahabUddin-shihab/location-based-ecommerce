const Router= require('express').Router();


Router.use('/city',require('./city.route'));
Router.use('/category',require('./category.route'));


module.exports= Router;