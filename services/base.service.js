class BaseService {

    constructor(repository){
        this.repository= repository
    }

    async create(){
        
        return await this.repository.create(data);
    }

    async getById(id, populate= null){

        let items= this.repository.getById
        if(!items){
            return "Not Found";
        }
        return await items;
    }

    async getAll(filter= {}, options= {}){

        return await this.repository.find(filter, options)
    }

    async update(id, data){

        let item= this.repository.update(id,data);
        if(!item){
            return "Not Found";
        }
        return item;
    }

    async delete(id){

        let item= this.repository.delete(id);
        if(!item){
            return "Not found";
        }
        return item;
    }

    async count(filter= {}){

        return await this.repository.count(filter);
    }
}

module.exports= BaseService