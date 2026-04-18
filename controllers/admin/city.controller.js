const CityService= require('../../services/city.service');
const catchAsync= require('../../utils/catchAsync')
const ApiResponse= require('../../utils/ApiResponse');

class CityController {

    constructor(){
        this.CityService= new CityService;
    }

    index= catchAsync(async(req,res,next)=>{
        
        const { id }= req.params;
        const {page=1, limit=10 }= req.query;

        const options= {
            limit: parseInt(limit),
            skip: (parseInt(page)-1)* parseInt(limit),
            sort: { createdAt: -1 },
        }
       
        const result= this.CityService.getAll({},options);
        const total= result.length || 0;
        ApiResponse.paginated(res,result,page,limit,total,"Cities are fetching successfullly");
    });

    store= catchAsync(async(req,res)=>{
        return res.json(req.body);
        // const city= this.CityService.create(req.body);
        // res.status(201).json(ApiResponse.success(res,city,"City created successfully"));
    });
    
}
module.exports= new CityController();