const BaseRepository= require('./base.repository');
const Category= require('../models/category.model');

class CategoryRepository extends BaseRepository {

    constructor(){
        super(Category);
    }
}

module.exports= CategoryRepository