const Subcategory= require('../models/subcategory.model');
const BaseRepository= require('./base.repository');


class SubcategoryRepository extends BaseRepository{

    constructor(){
        super(Subcategory)
    }
}
module.exports= SubcategoryRepository