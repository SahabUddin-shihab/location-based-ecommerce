const CartService = require('../../services/cart.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    index = catchAsync(async (req, res) => {
        const cart = await this.cartService.getCart(req.user._id);
        return ApiResponse.success(res, cart, 'Cart fetched');
    });

    addItem = catchAsync(async (req, res) => {
        const { productId, quantity = 1, variant } = req.body;
        const cart = await this.cartService.addItem(req.user._id, productId, quantity, variant);
        return ApiResponse.success(res, cart, 'Added to cart');
    });

    updateItem = catchAsync(async (req, res) => {
        const { quantity } = req.body;
        const cart = await this.cartService.updateItem(req.user._id, req.params.itemId, quantity);
        return ApiResponse.success(res, cart, 'Cart updated');
    });

    removeItem = catchAsync(async (req, res) => {
        const cart = await this.cartService.removeItem(req.user._id, req.params.itemId);
        return ApiResponse.success(res, cart, 'Item removed');
    });

    clearCart = catchAsync(async (req, res) => {
        await this.cartService.clearCart(req.user._id);
        return ApiResponse.success(res, null, 'Cart cleared');
    });

    applyCoupon = catchAsync(async (req, res) => {
        const cart = await this.cartService.applyCoupon(req.user._id, req.body.code);
        return ApiResponse.success(res, cart, 'Coupon applied');
    });

    removeCoupon = catchAsync(async (req, res) => {
        const cart = await this.cartService.removeCoupon(req.user._id);
        return ApiResponse.success(res, cart, 'Coupon removed');
    });

    checkoutSummary = catchAsync(async (req, res) => {
        const { shippingZone } = req.query;
        const summary = await this.cartService.getCheckoutSummary(req.user._id, shippingZone);
        return ApiResponse.success(res, summary, 'Checkout summary');
    });
}

module.exports = new CartController();
