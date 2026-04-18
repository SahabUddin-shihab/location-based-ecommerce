const BaseRepository= require('./base.repository');
const Category= require('../models/Category');

class CategoryRepository extends BaseRepository {

    constructor(){
        super(Category);
    }
}

module.exports= CategoryRepository