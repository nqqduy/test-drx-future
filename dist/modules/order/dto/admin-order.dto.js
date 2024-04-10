"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrderDto = void 0;
const tslib_1 = require("tslib");
const order_enum_1 = require("../../../shares/enums/order.enum");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AdminOrderDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'BUY',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "side", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'LIMIT',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'BTCUSDT',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '2023-01-21',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "from", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '2023-02-21',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "to", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: true,
    }),
    class_validator_1.IsOptional(),
    class_transformer_1.Transform(({ value }) => (value === 'true' ? true : false)),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "isActive", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "contractType", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: order_enum_1.EOrderBy.COST,
    }),
    class_validator_1.IsEnum(order_enum_1.EOrderBy),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "orderBy", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: order_enum_1.EDirection.ASC,
    }),
    class_validator_1.IsEnum(order_enum_1.EDirection),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminOrderDto.prototype, "direction", void 0);
exports.AdminOrderDto = AdminOrderDto;
//# sourceMappingURL=admin-order.dto.js.map