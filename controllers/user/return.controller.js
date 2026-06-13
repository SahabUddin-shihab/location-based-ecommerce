const ReturnService = require('../../services/return.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class UserReturnController {
    constructor() {
        this.returnService = new ReturnService();
    }

    create = catchAsync(async (req, res) => {
        const returnReq = await this.returnService.create(req.user._id, req.params.orderId, req.body);
        return ApiResponse.success(res, returnReq, 'Return request submitted successfully', 201);
    });

    myReturns = catchAsync(async (req, res) => {
        const returns = await this.returnService.getUserReturns(req.user._id);
        return ApiResponse.success(res, returns, 'Return requests fetched');
    });
}

module.exports = new UserReturnController();
