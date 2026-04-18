const BaseService= require('./base.service');
const CityRepository= require('../repositories/city.repository');

class CityService extends BaseService{
    
    constructor(){
        super(new CityRepository())
    }
}

module.exports= CityService