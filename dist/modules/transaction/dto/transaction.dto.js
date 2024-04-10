"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHistoryDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shares/dtos/pagination.dto");
const order_enum_1 = require("../../../shares/enums/order.enum");
const transaction_enum_1 = require("../../../shares/enums/transaction.enum");
class TransactionHistoryDto extends pagination_dto_1.PaginationDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Start time in timestamp' }),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], TransactionHistoryDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Start time in timestamp' }),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], TransactionHistoryDto.prototype, "endTime", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: false, description: 'Asset transaction', example: 'USDT' }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], TransactionHistoryDto.prototype, "asset", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: false, description: 'Type of transaction', enum: transaction_enum_1.TransactionType, example: 'DEPOSIT' }),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], TransactionHistoryDto.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
        enum: ['USD_M', 'COIN_M'],
    }),
    class_validator_1.IsString(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], TransactionHistoryDto.prototype, "contractType", void 0);
exports.TransactionHistoryDto = TransactionHistoryDto;
//# sourceMappingURL=transaction.dto.js.map