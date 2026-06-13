const OrderService = require('../../services/order.service');
const catchAsync = require('../../utils/catchAsync');
const ApiResponse = require('../../utils/ApiResponse');

class AdminOrderController {
    constructor() {
        this.orderService = new OrderService();
    }

    index = catchAsync(async (req, res) => {
        const { page = 1, limit = 20, status, paymentStatus, paymentMethod, search, fromDate, toDate } = req.query;
        const filters = { status, paymentStatus, paymentMethod, search, fromDate, toDate };
        const { orders, total } = await this.orderService.getAdminOrders(filters, { page, limit });
        return ApiResponse.paginated(res, orders, page, limit, total, 'Orders fetched');
    });

    show = catchAsync(async (req, res) => {
        const order = await this.orderService.getOrderDetail(req.params.id, null);
        return ApiResponse.success(res, order, 'Order detail');
    });

    updateStatus = catchAsync(async (req, res) => {
        const { status, note } = req.body;
        const order = await this.orderService.updateOrderStatus(req.params.id, status, note, req.admin._id);
        return ApiResponse.success(res, order, 'Order status updated');
    });

    dashboard = catchAsync(async (req, res) => {
        const { days = 30 } = req.query;
        const [stats, chart] = await Promise.all([
            this.orderService.getDashboardStats(),
            this.orderService.getSalesChart(parseInt(days))
        ]);
        return ApiResponse.success(res, { stats, chart }, 'Dashboard data');
    });
}

module.exports = new AdminOrderController();
