"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoryDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class OrderHistoryDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1672194339532,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], OrderHistoryDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1682194339532,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], OrderHistoryDto.prototype, "endTime", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'BUY',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OrderHistoryDto.prototype, "side", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'LIMIT',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OrderHistoryDto.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'ADABTC_DELIVERY',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OrderHistoryDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: true,
    }),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Boolean)
], OrderHistoryDto.prototype, "isActive", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'FILLED',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OrderHistoryDto.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], OrderHistoryDto.prototype, "contractType", void 0);
exports.OrderHistoryDto = OrderHistoryDto;
//# sourceMappingURL=order-history.dto.js.map