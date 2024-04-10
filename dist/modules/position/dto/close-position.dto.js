"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosePositionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const positive_bignumber_decorator_1 = require("../../../shares/decorators/positive-bignumber.decorator");
const position_enum_1 = require("../../../shares/enums/position.enum");
class ClosePositionDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], ClosePositionDto.prototype, "positionId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], ClosePositionDto.prototype, "quantity", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: position_enum_1.ClosePositionType.MARKET,
    }),
    class_validator_1.IsEnum(position_enum_1.ClosePositionType),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], ClosePositionDto.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    tslib_1.__metadata("design:type", String)
], ClosePositionDto.prototype, "limitPrice", void 0);
exports.ClosePositionDto = ClosePositionDto;
//# sourceMappingURL=close-position.dto.js.map