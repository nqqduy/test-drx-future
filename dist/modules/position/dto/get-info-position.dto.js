"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInforPositionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetInforPositionDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'BTCUSDT',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], GetInforPositionDto.prototype, "symbol", void 0);
exports.GetInforPositionDto = GetInforPositionDto;
//# sourceMappingURL=get-info-position.dto.js.map