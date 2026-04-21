const CategoryService= require('../../services/category.service');
const catchAsync= require('../../utils/catchAsync');
const ApiResponse= require('../../utils/ApiResponse');

class CategoryController{

    constructor(){
        this.CategoryService= new CategoryService
    }

    index= catchAsync(async(req,res)=>{
        const { page= 1, limit= 10 }= req.query;

        const options= {
            limit: parseInt(limit),
            skip: (parseInt(page)-1) * parseInt(limit),
            sort: { createdAt: -1 },
            populate: {
                path: 'city',
                select: 'name'
            }
        }
        const result= await this.CategoryService.getAll({},options);
        const total= result.length;

        ApiResponse.paginated(res,result,page,limit,total,'Category Data fecth successfully');
    });

    store= catchAsync(async(req,res)=>{

        const createResult= await this.CategoryService.create(req.body);
        return ApiResponse.success(res,createResult,'Category create successfully');
    });

    edit= catchAsync(async(req,res)=>{

        const { id }= req.params;
        const editResult= await this.CategoryService.getById(id);
        return ApiResponse.success(res,editResult,'Fecth category by ID successfully');
    });

    update= catchAsync(async(req,res)=>{
        const { id }= req.params;
        
        const updateResult= await this.CategoryService.update(id,req.body);
        return ApiResponse.success(res,updateResult,"Category update successfully");
    });

    delete= catchAsync(async(req,res)=>{
        const { id }= req.params;

        const deleteResult= await this.CategoryService.delete(id);
        return ApiResponse.success(res,deleteResult,'Category delete successfully');
    });

}

module.exports= new CategoryController()