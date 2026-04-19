const BaseService= require('./base.service');
const CategoryRepository= require('../repositories/category.repository');

class CategoryService extends BaseService {

    constructor(){
        super(new CategoryRepository());
    }
}

module.exports= CategoryService;