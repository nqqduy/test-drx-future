"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const balance_service_1 = require("./balance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const response_dto_1 = require("../../shares/dtos/response.dto");
const account_entity_1 = require("../../models/entities/account.entity");
const balance_dto_1 = require("./balance.dto");
const exceptions_1 = require("../../shares/exceptions");
let BalanceController = class BalanceController {
    constructor(balanceService) {
        this.balanceService = balanceService;
    }
    async getAllAccountByOwner(userId) {
        return {
            data: await this.balanceService.getUserBalance(userId),
        };
    }
    async getAssets(userId) {
        const assets = await this.balanceService.getAssets(userId);
        return assets;
    }
    async getBalanceInfor(userId, query) {
        return this.balanceService.getInforBalance(userId, query.symbol);
    }
    async getBalanceFuture(userId, futureUser, futurePassword) {
        const futureUserEnv = process.env.FUTURE_USER;
        const futurePasswordEnv = process.env.FUTURE_PASSWORD;
        if (futureUser !== futureUserEnv || futurePassword !== futurePasswordEnv) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        return {
            data: await this.balanceService.getUserBalance(userId),
        };
    }
    async getTotalBalanceAllUser(futureUser, futurePassword) {
        const futureUserEnv = process.env.FUTURE_USER;
        const futurePasswordEnv = process.env.FUTURE_PASSWORD;
        if (futureUser !== futureUserEnv || futurePassword !== futurePasswordEnv) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        return {
            data: await this.balanceService.getTotalUserBalances()
        };
    }
};
tslib_1.__decorate([
    common_1.Get('/'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BalanceController.prototype, "getAllAccountByOwner", null);
tslib_1.__decorate([
    common_1.Get('/assets'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BalanceController.prototype, "getAssets", null);
tslib_1.__decorate([
    common_1.Get('/infor'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, balance_dto_1.GetInforBalanceDto]),
    tslib_1.__metadata("design:returntype", Promise)
], BalanceController.prototype, "getBalanceInfor", null);
tslib_1.__decorate([
    common_1.Get('/total-balances/:userId'),
    tslib_1.__param(0, common_1.Param('userId')),
    tslib_1.__param(1, common_1.Body('futureUser')),
    tslib_1.__param(2, common_1.Body('futurePassword')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], BalanceController.prototype, "getBalanceFuture", null);
tslib_1.__decorate([
    common_1.Get('/user-balances'),
    tslib_1.__param(0, common_1.Body('futureUser')),
    tslib_1.__param(1, common_1.Body('futurePassword')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], BalanceController.prototype, "getTotalBalanceAllUser", null);
BalanceController = tslib_1.__decorate([
    common_1.Controller('balance'),
    swagger_1.ApiTags('balance'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [balance_service_1.BalanceService])
], BalanceController);
exports.BalanceController = BalanceController;
//# sourceMappingURL=balance.controller.js.map