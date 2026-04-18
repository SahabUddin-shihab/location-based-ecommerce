const Router= require('express').Router();


Router.use('/city',require('./city.route'));


module.exports= Router;