const ReturnService = require('../../services/return.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AdminReturnController {
    constructor() {
        this.returnService = new ReturnService();
    }

    index = catchAsync(async (req, res) => {
        const { page = 1, limit = 20, status } = req.query;
        const { returns, total } = await this.returnService.getAll(
            { status },
            { page: parseInt(page), limit: parseInt(limit) }
        );
        return ApiResponse.paginated(res, returns, page, limit, total, 'Return requests fetched');
    });

    process = catchAsync(async (req, res) => {
        const returnReq = await this.returnService.process(req.params.id, req.admin._id, req.body);
        return ApiResponse.success(res, returnReq, 'Return request processed');
    });
}

module.exports = new AdminReturnController();
