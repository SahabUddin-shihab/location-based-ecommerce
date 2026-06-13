const AuthService = require('../../services/auth.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    register = catchAsync(async (req, res) => {
        const result = await this.authService.register(req.body);
        return ApiResponse.success(res, result, 'Registered successfully. Please verify your email.', 201);
    });

    login = catchAsync(async (req, res) => {
        const { email, password } = req.body;
        const result = await this.authService.login(email, password);
        return ApiResponse.success(res, result, 'Logged in successfully');
    });

    logout = catchAsync(async (req, res) => {
        await this.authService.logout(req.user._id);
        return ApiResponse.success(res, null, 'Logged out successfully');
    });

    refreshToken = catchAsync(async (req, res) => {
        const { refreshToken } = req.body;
        const result = await this.authService.refreshAccessToken(refreshToken);
        return ApiResponse.success(res, result, 'Token refreshed');
    });

    verifyEmail = catchAsync(async (req, res) => {
        const { token } = req.params;
        await this.authService.verifyEmail(token);
        return ApiResponse.success(res, null, 'Email verified successfully');
    });

    forgotPassword = catchAsync(async (req, res) => {
        await this.authService.forgotPassword(req.body.email);
        return ApiResponse.success(res, null, 'If that email exists, a reset link has been sent');
    });

    resetPassword = catchAsync(async (req, res) => {
        const { token } = req.params;
        await this.authService.resetPassword(token, req.body.password);
        return ApiResponse.success(res, null, 'Password reset successfully');
    });

    changePassword = catchAsync(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        await this.authService.changePassword(req.user._id, currentPassword, newPassword);
        return ApiResponse.success(res, null, 'Password changed successfully');
    });

    getMe = catchAsync(async (req, res) => {
        return ApiResponse.success(res, req.user, 'Profile fetched');
    });
}

module.exports = new AuthController();
