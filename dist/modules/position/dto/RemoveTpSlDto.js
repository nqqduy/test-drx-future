"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTpSlDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RemoveTpSlDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], RemoveTpSlDto.prototype, "positionId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], RemoveTpSlDto.prototype, "takeProfitOrderId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], RemoveTpSlDto.prototype, "stopLossOrderId", void 0);
exports.RemoveTpSlDto = RemoveTpSlDto;
//# sourceMappingURL=RemoveTpSlDto.js.map