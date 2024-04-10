"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenOrderDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class OpenOrderDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'BUY',
        description: 'Side of order want to get',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OpenOrderDto.prototype, "side", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'STOP_LIMIT',
        description: 'Type of order',
        enum: ['LIMIT', 'STOP_LIMIT', 'STOP_MARKET', 'TRAILING_STOP', 'TAKE_PROFIT', 'STOP_LOSS'],
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OpenOrderDto.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'ADABTC',
        description: 'Get from /api/v1/ticker/24h',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], OpenOrderDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
        enum: ['USD_M', 'COIN_M'],
    }),
    class_validator_1.IsString(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], OpenOrderDto.prototype, "contractType", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        description: 'Get all (ignore pagination) if true',
    }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Boolean)
], OpenOrderDto.prototype, "getAll", void 0);
exports.OpenOrderDto = OpenOrderDto;
//# sourceMappingURL=open-order.dto.js.map