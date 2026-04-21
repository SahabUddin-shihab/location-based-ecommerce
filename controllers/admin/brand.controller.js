const BrandService= require('../../services/brand.service');
const catchAsync= require('../../utils/catchAsync')
const ApiResponse= require('../../utils/ApiResponse');

class BrandController {

    constructor(){
        this.BrandService= new BrandService;
    }

    index= catchAsync(async(req,res,next)=>{
        
        const {page=1, limit=10 }= req.query;

        const options= {
            limit: parseInt(limit),
            skip: (parseInt(page)-1)* parseInt(limit),
            sort: { createdAt: -1 },

        }
       
        const result= await this.BrandService.getAll({},options);
    
        const total= result.length;
        ApiResponse.paginated(res,result,page,limit,total,"Brands are fetching successfullly");
    });

    store= catchAsync(async(req,res)=>{

        const createResult= await this.BrandService.create(req.body);
        return ApiResponse.success(res, createResult, "Brand created successfully");
    });

    edit= catchAsync(async(req,res)=>{

        const { id }= req.params;
        const editResult= await this.BrandService.getById(id);
        return ApiResponse.success(res,editResult, 'Brand fetch by ID');
    });

    update= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const updateResult= await this.BrandService.update(id,req.body);
        return ApiResponse.success(res,updateResult,"Brand update successfully")
    });
    
    delete= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const deleteResult= await this.BrandService.delete(id);
        return ApiResponse.success(res,deleteResult,"Brand delete successfully")
    });
}
module.exports= new BrandController();