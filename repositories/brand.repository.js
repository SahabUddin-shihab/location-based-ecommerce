const Brand= require('../models/brand.model');
const BaseRepository= require('./base.repository');

class BrandRepository extends BaseRepository {
    
    constructor(){
        super(Brand);
    }
}

module.exports= BrandRepository