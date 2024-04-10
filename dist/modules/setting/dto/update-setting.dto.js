"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSettingDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateSettingDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        description: 'Value to be updated',
        example: '0.02',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateSettingDto.prototype, "value", void 0);
exports.UpdateSettingDto = UpdateSettingDto;
//# sourceMappingURL=update-setting.dto.js.map