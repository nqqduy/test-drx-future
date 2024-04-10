"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const tslib_1 = require("tslib");
const admin_order_dto_1 = require("./dto/admin-order.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("../../models/entities/order.entity");
const account_service_1 = require("../account/account.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const order_service_1 = require("./order.service");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const order_enum_1 = require("../../shares/enums/order.enum");
const create_order_dto_1 = require("./dto/create-order.dto");
const open_order_dto_1 = require("./dto/open-order.dto");
const order_history_dto_1 = require("./dto/order-history.dto");
const jwt_admin_guard_1 = require("../auth/guards/jwt.admin.guard");
let OrderController = class OrderController {
    constructor(orderService, accountService) {
        this.orderService = orderService;
        this.accountService = accountService;
    }
    async getHistoryOrders(userId, paging, orderHistoryDto) {
        const response = await this.orderService.getHistoryOrders(userId, paging, orderHistoryDto);
        return response;
    }
    async getAllOrderAdmin(paging, queries) {
        const response = await this.orderService.getOrderByAdmin(paging, queries);
        return response;
    }
    async getOneOrder(userId, orderId) {
        const response = await this.orderService.getOneOrder(orderId, userId);
        return response;
    }
    async getAllOrder(paging, userId, openOrderDto) {
        const response = await this.orderService.getOpenOrderByAccountId(paging, userId, openOrderDto);
        return response;
    }
    async createOrder(createOrderDto, userId) {
        const account = await this.accountService.getFirstAccountByOwnerId(userId, createOrderDto.asset);
        const validatedCreateOrder = await this.orderService.validateOrder(createOrderDto);
        return {
            data: await this.orderService.createOrder(validatedCreateOrder, {
                accountId: account.id,
                userId,
                email: account.userEmail,
            }),
        };
    }
    async cancelOrderByType(userId, type, contractType) {
        const canceledOrders = await this.orderService.cancelAllOrder(userId, type, contractType);
        return {
            data: canceledOrders,
        };
    }
    async getRootOrder(userId, orderId, type) {
        const account = await this.accountService.getFirstAccountByOwnerId(userId);
        const canceledOrders = await this.orderService.getRootOrder(account.id, orderId, type);
        return {
            data: canceledOrders,
        };
    }
    async cancelOrder(orderId, userId) {
        const canceledOrder = await this.orderService.cancelOrder(orderId, userId);
        return {
            data: canceledOrder,
        };
    }
    async getTpSlOrder(rootOrderId) {
        const orders = await this.orderService.getTpSlOrder(rootOrderId);
        return {
            data: orders,
        };
    }
    async updateTpSlOrder(userId, updateTpSlOrderDto, rootOrderId) {
        const orders = await this.orderService.updateTpSlOrder(userId, updateTpSlOrderDto, rootOrderId);
        return {
            data: orders,
        };
    }
};
tslib_1.__decorate([
    common_1.Post('/history'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto,
        order_history_dto_1.OrderHistoryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getHistoryOrders", null);
tslib_1.__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [pagination_dto_1.PaginationDto,
        admin_order_dto_1.AdminOrderDto]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrderAdmin", null);
tslib_1.__decorate([
    common_1.Get('/my-order/:orderId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Param('orderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getOneOrder", null);
tslib_1.__decorate([
    common_1.Post('/open'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Number, open_order_dto_1.OpenOrderDto]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrder", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiOperation({
        description: `
    When place:
    Limit order: type = "LIMIT", tpSLType = ""
    Market order: type = "MARKET", tpSLType = ""
    Stop limit order: type = "LIMIT", tpSLType = "STOP_LIMIT", tpSLPrice, stopCondition, trigger
    Stop market order: type = "MARKET", tpSLType = "STOP_MARKET", tpSLPrice, stopCondition, trigger
    Trailing stop order: type = "MARKET", tpSLType = "TRAILING_STOP", stopCondition, activationPrice, callbackRate,
    Post only order: isPostOnly = true
    `,
    }),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
tslib_1.__decorate([
    common_1.Delete('/cancel-order'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query('type')),
    tslib_1.__param(2, common_1.Query('contractType')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrderByType", null);
tslib_1.__decorate([
    common_1.Get('/get-root-order'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query('orderId')),
    tslib_1.__param(2, common_1.Query('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getRootOrder", null);
tslib_1.__decorate([
    common_1.Delete('/:orderId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('orderId')), tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
tslib_1.__decorate([
    common_1.Get('/tp-sl/:rootOrderId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('rootOrderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getTpSlOrder", null);
tslib_1.__decorate([
    common_1.Put('/tp-sl/:rootOrderId'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__param(2, common_1.Param('rootOrderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Array, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "updateTpSlOrder", null);
OrderController = tslib_1.__decorate([
    common_1.Controller('order'),
    swagger_1.ApiTags('Order'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [order_service_1.OrderService, account_service_1.AccountService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map