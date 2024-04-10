"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarginModeDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class UpdateMarginModeDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Id of instrument, get from GET: `/api/v1/instruments`', example: 1 }),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Number)
], UpdateMarginModeDto.prototype, "instrumentId", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'New margin mode', enum: order_enum_1.MarginMode }),
    class_validator_1.IsOptional(),
    class_validator_1.IsEnum(order_enum_1.MarginMode),
    tslib_1.__metadata("design:type", String)
], UpdateMarginModeDto.prototype, "marginMode", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'New leverage', example: '25' }),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], UpdateMarginModeDto.prototype, "leverage", void 0);
exports.UpdateMarginModeDto = UpdateMarginModeDto;
//# sourceMappingURL=update-user-margin-mode.dto.js.map