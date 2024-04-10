"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const account_history_entity_1 = require("../../models/entities/account-history.entity");
const account_entity_1 = require("../../models/entities/account.entity");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const account_service_1 = require("./account.service");
const body_withdraw_dto_1 = require("./dto/body-withdraw.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const from_to_dto_1 = require("../../shares/dtos/from-to.dto");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async getAccountByUserId(userId) {
        return {
            data: await this.accountService.getFirstAccountByOwnerId(userId),
        };
    }
    async getAllAccountByOwner(userId, symbol) {
        return {
            data: await this.accountService.getFirstAccountByOwnerId(userId, symbol),
        };
    }
    async withdrawal(ownerId, withdrawDto) {
        return {
            data: await this.accountService.withdraw(ownerId, withdrawDto),
        };
    }
    async getAccountBalanceFromTo(userId, ft, symbol) {
        const account = await this.accountService.getFirstAccountByOwnerId(userId, symbol);
        const balances = await this.accountService.findBalanceFromTo(account.id, ft);
        return {
            data: balances,
        };
    }
    async getBalance(userId, symbol) {
        const balances = await this.accountService.getBalanceV2(userId, symbol);
        return Object.assign({}, balances);
    }
    async getTransferHistory(userId, paging, type, symbol) {
        const account = await this.accountService.getFirstAccountByOwnerId(userId, symbol);
        const response = await this.accountService.getTransferHistory(account.id, type, paging);
        return response;
    }
};
tslib_1.__decorate([
    common_1.Get(''),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "getAccountByUserId", null);
tslib_1.__decorate([
    common_1.Get('/:symbol'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Param('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "getAllAccountByOwner", null);
tslib_1.__decorate([
    common_1.Post('/withdraw'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, body_withdraw_dto_1.WithdrawalDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "withdrawal", null);
tslib_1.__decorate([
    common_1.Get('/history/balance/:symbol'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiQuery({
        name: 'from',
        required: false,
        example: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
    }),
    swagger_1.ApiQuery({
        name: 'to',
        required: false,
        example: new Date().getTime(),
    }),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__param(2, common_1.Param('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, from_to_dto_1.FromToDto, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "getAccountBalanceFromTo", null);
tslib_1.__decorate([
    common_1.Get('/balance/:symbol'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Param('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "getBalance", null);
tslib_1.__decorate([
    common_1.Get('/history/transfer/:symbol'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiQuery({
        name: 'type',
        required: false,
        example: transaction_enum_1.TransactionType.DEPOSIT,
        enum: [transaction_enum_1.TransactionType.DEPOSIT, transaction_enum_1.TransactionType.WITHDRAWAL],
    }),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Query()),
    tslib_1.__param(2, common_1.Query('type')),
    tslib_1.__param(3, common_1.Param('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "getTransferHistory", null);
AccountController = tslib_1.__decorate([
    common_1.Controller('account'),
    swagger_1.ApiTags('Account'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map