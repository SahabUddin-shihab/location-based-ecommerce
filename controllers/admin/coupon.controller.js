const CouponService = require('../../services/coupon.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AdminCouponController {
    constructor() {
        this.couponService = new CouponService();
    }

    index = catchAsync(async (req, res) => {
        const { page = 1, limit = 20, isActive, search } = req.query;
        const filters = { search };
        if (isActive !== undefined) filters.isActive = isActive === 'true';
        const { coupons, total } = await this.couponService.getAll(filters, {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            sort: { createdAt: -1 }
        });
        return ApiResponse.paginated(res, coupons, page, limit, total, 'Coupons fetched');
    });

    store = catchAsync(async (req, res) => {
        req.body.createdBy = req.admin._id;
        const coupon = await this.couponService.create(req.body);
        return ApiResponse.success(res, coupon, 'Coupon created', 201);
    });

    edit = catchAsync(async (req, res) => {
        const coupon = await this.couponService.getById(req.params.id);
        return ApiResponse.success(res, coupon, 'Coupon fetched');
    });

    update = catchAsync(async (req, res) => {
        const coupon = await this.couponService.update(req.params.id, req.body);
        return ApiResponse.success(res, coupon, 'Coupon updated');
    });

    delete = catchAsync(async (req, res) => {
        await this.couponService.delete(req.params.id);
        return ApiResponse.success(res, null, 'Coupon deleted');
    });
}

module.exports = new AdminCouponController();
