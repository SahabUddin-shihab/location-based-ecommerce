const OrderService = require('../../services/order.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class OrderController {
    constructor() {
        this.orderService = new OrderService();
    }

    placeOrder = catchAsync(async (req, res) => {
        
        const order = await this.orderService.placeOrder(req.user._id, req.body);
        return ApiResponse.success(res, order, 'Order placed successfully', 201);
    });

    myOrders = catchAsync(async (req, res) => {
        const { page = 1, limit = 10, status } = req.query;
        const { orders, total } = await this.orderService.getUserOrders(req.user._id, { page, limit, status });
        return ApiResponse.paginated(res, orders, page, limit, total, 'Orders fetched');
    });

    show = catchAsync(async (req, res) => {
        const order = await this.orderService.getOrderDetail(req.params.id, req.user._id);
        return ApiResponse.success(res, order, 'Order detail');
    });

    cancel = catchAsync(async (req, res) => {
        const order = await this.orderService.cancelOrder(req.params.id, req.user._id, req.body.reason);
        return ApiResponse.success(res, order, 'Order cancelled');
    });
}

module.exports = new OrderController();
