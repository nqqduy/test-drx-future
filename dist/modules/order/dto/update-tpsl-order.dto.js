"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTpSlOrderDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const positive_bignumber_decorator_1 = require("../../../shares/decorators/positive-bignumber.decorator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class UpdateTpSlOrderDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Number)
], UpdateTpSlOrderDto.prototype, "orderId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: '18000',
    }),
    class_validator_1.IsOptional(),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    tslib_1.__metadata("design:type", String)
], UpdateTpSlOrderDto.prototype, "tpSLPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'LAST',
    }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTrigger)),
    tslib_1.__metadata("design:type", String)
], UpdateTpSlOrderDto.prototype, "trigger", void 0);
exports.UpdateTpSlOrderDto = UpdateTpSlOrderDto;
//# sourceMappingURL=update-tpsl-order.dto.js.map