const BaseService= require('./base.service');
const CategoryRepository= require('../repositories/category.repository');

class Category extends BaseService {

    constructor(){
        super(new CategoryRepository());
    }
}

module.exports= Category;