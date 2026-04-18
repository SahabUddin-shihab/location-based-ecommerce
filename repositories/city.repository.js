const CityModel= require('../models/city.model');
const BaseRepository= require('./base.repository');

class CityRepository extends BaseRepository {
    
    constructor(){
        super(CityModel);
    }
}

module.exports= CityRepository