const BaseService= require('./base.service');
const SubcategoryRepository= require('../repositories/subcategory.repository');

class SubcategoryService extends BaseService{

    constructor(){
        super(new SubcategoryRepository());
    }
}

module.exports= SubcategoryService;