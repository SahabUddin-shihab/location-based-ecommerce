const BannerService = require('../../services/banner.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AdminBannerController {
    constructor() {
        this.bannerService = new BannerService();
    }

    index = catchAsync(async (req, res) => {
        const { page = 1, limit = 20, isActive, position } = req.query;
        const filters = { position };
        if (isActive !== undefined) filters.isActive = isActive === 'true';
        const { banners, total } = await this.bannerService.getAll(filters, {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        });
        return ApiResponse.paginated(res, banners, page, limit, total, 'Banners fetched successfully');
    });

    store = catchAsync(async (req, res) => {
        if (req.file) req.body.image = `/uploads/banners/${req.file.filename}`;
        if (!req.body.image) throw require('../../utils/ApiError').badRequest('Banner image is required');
        req.body.createdBy = req.admin._id;
        const banner = await this.bannerService.create(req.body);
        return ApiResponse.success(res, banner, 'Banner created successfully', 201);
    });

    edit = catchAsync(async (req, res) => {
        const banner = await this.bannerService.getById(req.params.id);
        return ApiResponse.success(res, banner, 'Banner fetched successfully');
    });

    update = catchAsync(async (req, res) => {
        if (req.file) req.body.image = `/uploads/banners/${req.file.filename}`;
        const banner = await this.bannerService.update(req.params.id, req.body);
        return ApiResponse.success(res, banner, 'Banner updated successfully');
    });

    delete = catchAsync(async (req, res) => {
        await this.bannerService.delete(req.params.id);
        return ApiResponse.success(res, null, 'Banner deleted successfully');
    });
}

module.exports = new AdminBannerController();
