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
            sort: { createdAt: -1 }
        }

        const result= await this.SubcategoryService.getAll({},options);
        const total= parseInt(result.length);
        ApiResponse.paginated(res,result,page,limit,total,"Subcategory fetch successfully");
    });
}

module.exports= new SubcategoryController();