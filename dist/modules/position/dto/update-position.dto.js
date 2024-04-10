"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validate_decorator_1 = require("../../order/decorator/validate-decorator");
const positive_bignumber_decorator_1 = require("../../../shares/decorators/positive-bignumber.decorator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class UpdatePositionDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], UpdatePositionDto.prototype, "positionId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('takeProfit'),
    tslib_1.__metadata("design:type", String)
], UpdatePositionDto.prototype, "takeProfit", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('stopLoss'),
    tslib_1.__metadata("design:type", String)
], UpdatePositionDto.prototype, "stopLoss", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTrigger)),
    tslib_1.__metadata("design:type", String)
], UpdatePositionDto.prototype, "takeProfitTrigger", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTrigger)),
    tslib_1.__metadata("design:type", String)
], UpdatePositionDto.prototype, "stopLossTrigger", void 0);
exports.UpdatePositionDto = UpdatePositionDto;
//# sourceMappingURL=update-position.dto.js.map