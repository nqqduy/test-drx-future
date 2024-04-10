"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSettingDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSettingDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        description: 'Value to be created',
        example: '0.02',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateSettingDto.prototype, "value", void 0);
exports.CreateSettingDto = CreateSettingDto;
//# sourceMappingURL=create-setting.dto.js.map