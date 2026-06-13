const UserService = require('../../services/user.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    getProfile = catchAsync(async (req, res) => {
        const user = await this.userService.getProfile(req.user._id);
        return ApiResponse.success(res, user, 'Profile fetched');
    });

    updateProfile = catchAsync(async (req, res) => {
        if (req.file) req.body.avatar = `/uploads/users/${req.file.filename}`;
        const user = await this.userService.updateProfile(req.user._id, req.body);
        return ApiResponse.success(res, user, 'Profile updated');
    });

    getAddresses = catchAsync(async (req, res) => {
        const user = await this.userService.getProfile(req.user._id);
        return ApiResponse.success(res, user.addresses, 'Addresses fetched');
    });

    addAddress = catchAsync(async (req, res) => {
        const addresses = await this.userService.addAddress(req.user._id, req.body);
        return ApiResponse.success(res, addresses, 'Address added', 201);
    });

    updateAddress = catchAsync(async (req, res) => {
        const addresses = await this.userService.updateAddress(req.user._id, req.params.addressId, req.body);
        return ApiResponse.success(res, addresses, 'Address updated');
    });

    deleteAddress = catchAsync(async (req, res) => {
        const addresses = await this.userService.deleteAddress(req.user._id, req.params.addressId);
        return ApiResponse.success(res, addresses, 'Address deleted');
    });


    getWishlist = catchAsync(async (req, res) => {
        const wishlist = await this.userService.getWishlist(req.user._id);
        return ApiResponse.success(res, wishlist, 'Wishlist fetched');
    });

    toggleWishlist = catchAsync(async (req, res) => {
        const result = await this.userService.toggleWishlist(req.user._id, req.params.productId);
        return ApiResponse.success(res, result, `Product ${result.action} wishlist`);
    });


    getRecentlyViewed = catchAsync(async (req, res) => {
        const items = await this.userService.getRecentlyViewed(req.user._id);
        return ApiResponse.success(res, items, 'Recently viewed fetched');
    });
}

module.exports = new UserController();
