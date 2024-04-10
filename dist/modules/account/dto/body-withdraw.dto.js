"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const positive_bignumber_decorator_1 = require("../../../shares/decorators/positive-bignumber.decorator");
const transaction_enum_1 = require("../../../shares/enums/transaction.enum");
class WithdrawalDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    tslib_1.__metadata("design:type", String)
], WithdrawalDto.prototype, "amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum(transaction_enum_1.AssetType),
    tslib_1.__metadata("design:type", String)
], WithdrawalDto.prototype, "assetType", void 0);
exports.WithdrawalDto = WithdrawalDto;
//# sourceMappingURL=body-withdraw.dto.js.map