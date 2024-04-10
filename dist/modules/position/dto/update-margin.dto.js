"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarginDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validate_decorator_1 = require("../../order/decorator/validate-decorator");
class UpdateMarginDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 12,
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Number)
], UpdateMarginDto.prototype, "positionId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1000,
    }),
    class_validator_1.IsNumberString(),
    class_validator_1.IsNotEmpty(),
    validate_decorator_1.IsNotHaveSpace('assignedMarginValues'),
    tslib_1.__metadata("design:type", String)
], UpdateMarginDto.prototype, "assignedMarginValue", void 0);
exports.UpdateMarginDto = UpdateMarginDto;
//# sourceMappingURL=update-margin.dto.js.map