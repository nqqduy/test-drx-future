"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationSettingDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateNotificationSettingDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "limitOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "marketOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "stopLimitOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "stopMarketOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "traillingStopOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "takeProfitTrigger", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "stopLossTrigger", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        description: 'set 0 to disable',
    }),
    class_validator_1.IsOptional(),
    class_validator_1.Min(0.001),
    class_validator_1.Max(5),
    class_validator_1.IsNumber({ maxDecimalPlaces: 4 }),
    tslib_1.__metadata("design:type", Number)
], UpdateNotificationSettingDto.prototype, "fundingFeeTriggerValue", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateNotificationSettingDto.prototype, "fundingFeeTrigger", void 0);
exports.UpdateNotificationSettingDto = UpdateNotificationSettingDto;
//# sourceMappingURL=user-setting-dto.js.map