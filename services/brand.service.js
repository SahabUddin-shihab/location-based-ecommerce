const BaseService= require('./base.service');
const BrandRepository= require('../repositories/brand.repository');

class BrandService extends BaseService{
    
    constructor(){
        super(new BrandRepository())
    }
}

module.exports= BrandService