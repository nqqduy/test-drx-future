"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeverageMarginDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LeverageMarginDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "tier", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "instrumentId", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({
        example: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "min", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({
        example: 3,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "max", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({
        example: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "maxLeverage", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({
        example: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "maintenanceMarginRate", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({
        example: 2,
    }),
    tslib_1.__metadata("design:type", Number)
], LeverageMarginDto.prototype, "maintenanceAmount", void 0);
exports.LeverageMarginDto = LeverageMarginDto;
//# sourceMappingURL=leverage-margin.dto.js.map