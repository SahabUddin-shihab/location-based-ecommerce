const ApiError = require("../utils/ApiError");

class BaseService {

    constructor(repository){
        this.repository= repository
    }

    async create(data){
        
        return await this.repository.create(data);
    }

    async getById(id, populate= null){

        let items= this.repository.getById
        if(!items){
           throw ApiError.notFound(`${this.repository.model.modelName} not found`)
        }
        return await items;
    }

    async getAll(filter= {}, options= {}){

        return await this.repository.find(filter, options)
    }

    async update(id, data){

        let item= this.repository.updateById(id,data);
        if(!item){
            throw ApiError.notFound(`${this.repository.model.modelName} not found`)
        }
        return item;
    }

    async delete(id){

        let item= await this.repository.delete(id);
        if(!item){
           throw ApiError.notFound(`${this.repository.model.modelName} not found`)
        }
        return item;
    }
    
    async count(filter= {}){

        return await this.repository.count(filter);
    }
}
module.exports= BaseService