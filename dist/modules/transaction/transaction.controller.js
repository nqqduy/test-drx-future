"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const transaction_dto_1 = require("./dto/transaction.dto");
const transaction_service_1 = require("./transaction.service");
let TransactionController = class TransactionController {
    constructor(transactionnModeService) {
        this.transactionnModeService = transactionnModeService;
    }
    async getTransactions(userId, input) {
        return {
            data: await this.transactionnModeService.transactionHistory(userId, input),
        };
    }
};
tslib_1.__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, transaction_dto_1.TransactionHistoryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactions", null);
TransactionController = tslib_1.__decorate([
    common_1.Controller('transactions'),
    swagger_1.ApiTags('transactions'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map