const ApiResponse= require('../../utils/ApiResponse')
const SubcategoryService= require('../../services/subcategory.service');
const catchAsync= require('../../utils/catchAsync');


class SubcategoryController{

    constructor(){
        this.SubcategoryService= new SubcategoryService;
    }

    index= catchAsync( async(req,res)=>{
        
        const { page= 1, limit=10 }= req.query;
        const options= {
            limit: parseInt(limit),
            skip: (parseInt(page)-1) * parseInt(limit),
            sort: { createdAt: -1 },
            populate: {
                path: 'category',
                select: 'name'
            }
        }

        const result= await this.SubcategoryService.getAll({},options);
        const total= parseInt(result.length);
        ApiResponse.paginated(res,result,page,limit,total,"Subcategory fetch successfully");
    });


    store=catchAsync(async(req,res)=>{
        const createResult= this.SubcategoryService.create(req.body);
        return ApiResponse.success(res,createResult,'Create sub-category successfully');
    });

    edit= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const editResult= await this.SubcategoryService.getById(id);
        return ApiResponse.success(res,editResult,'Fetch category by id');
    });

    update= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const updateResult= await this.SubcategoryService.update(id,req.body);
        return ApiResponse.success(res,updateResult,'Subcategory update successfully');
    });

    delete= catchAsync(async(req,res)=>{
        const { id }= req.params;
        const deleteResult= await this.SubcategoryService.delete(id);
        return ApiResponse.success(res,deleteResult, 'Delete subcategory successfully');
    });
}

module.exports= new SubcategoryController();