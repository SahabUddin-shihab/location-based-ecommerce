const CityService= require('../../services/city.service');
const catchAsync= require('../../utils/catchAsync')
const ApiResponse= require('../../utils/ApiResponse');

class CityController {

    constructor(){
        this.CityService= new CityService;
    }

    index= catchAsync(async(req,res,next)=>{
        
        const {page=1, limit=10 }= req.query;

        const options= {
            limit: parseInt(limit),
            skip: (parseInt(page)-1)* parseInt(limit),
            sort: { createdAt: -1 },

        }
       
        const result= await this.CityService.getAll({},options);
    
        const total= result.length;
        ApiResponse.paginated(res,result,page,limit,total,"Cities are fetching successfullly");
    });

    store= catchAsync(async(req,res)=>{

        const createResult= await this.CityService.create(req.body);
        return ApiResponse.success(res, createResult, "City created successfully");
    });

    update= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const updateResult= await this.CityService.update(id,req.body);
        return ApiResponse.success(res,updateResult,"City update successfully")
    });
    
    delete= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const deleteResult= await this.CityService.delete(id);
        return ApiResponse.success(res,deleteResult,"City delete successfully")
    });
}
module.exports= new CityController();