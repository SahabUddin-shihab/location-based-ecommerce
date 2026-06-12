const AdminAuthService = require('../../services/admin.auth.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AdminAuthController {
    constructor() {
        this.adminAuthService = new AdminAuthService();
    }

    login = catchAsync(async (req, res) => {
        const { email, password } = req.body;
        const result = await this.adminAuthService.login(email, password);
        return ApiResponse.success(res, result, 'Admin logged in successfully');
    });

    createAdmin = catchAsync(async (req, res) => {
        const admin = await this.adminAuthService.createAdmin(req.body);
        return ApiResponse.success(res, admin, 'Admin created successfully', 201);
    });

    getMe = catchAsync(async (req, res) => {
        return ApiResponse.success(res, req.admin, 'Admin profile fetched');
    });
}

module.exports = new AdminAuthController();
