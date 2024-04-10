"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeController = void 0;
const tslib_1 = require("tslib");
const admin_trade_dto_1 = require("./dto/admin-trade.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const trade_entity_1 = require("../../models/entities/trade.entity");
const account_service_1 = require("../account/account.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_fills_dto_1 = require("./dto/get-fills.dto");
const trade_service_1 = require("./trade.service");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const trade_history_dto_1 = require("./dto/trade-history.dto");
const jwt_admin_guard_1 = require("../auth/guards/jwt.admin.guard");
let TradeController = class TradeController {
    constructor(tradeService, accountService) {
        this.tradeService = tradeService;
        this.accountService = accountService;
    }
    async getFillTrade(userId, paging, tradeHistoryDto) {
        const response = await this.tradeService.getFillTrade(userId, paging, tradeHistoryDto);
        return response;
    }
    async getRecentTrades(symbol, paging) {
        return {
            data: await this.tradeService.getRecentTrades(symbol, paging),
        };
    }
    async getTrades(paging, queries) {
        const trades = await this.tradeService.getTrades(paging, queries);
        return trades;
    }
};
tslib_1.__decorate([
    common_1.Post('/fill'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto,
        trade_history_dto_1.TradeHistoryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TradeController.prototype, "getFillTrade", null);
tslib_1.__decorate([
    common_1.Get('/:symbol'),
    swagger_1.ApiParam({
        name: 'symbol',
        example: 'BTCUSD',
        required: true,
    }),
    tslib_1.__param(0, common_1.Param('symbol')),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TradeController.prototype, "getRecentTrades", null);
tslib_1.__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_admin_guard_1.JwtAdminGuard),
    tslib_1.__param(0, common_1.Query()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [pagination_dto_1.PaginationDto, admin_trade_dto_1.AdminTradeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TradeController.prototype, "getTrades", null);
TradeController = tslib_1.__decorate([
    common_1.Controller('trade'),
    swagger_1.ApiTags('Trade'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [trade_service_1.TradeService, account_service_1.AccountService])
], TradeController);
exports.TradeController = TradeController;
//# sourceMappingURL=trade.controller.js.map