"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTradeDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AdminTradeDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '2023-01-21',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], AdminTradeDto.prototype, "from", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: '2023-02-21',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], AdminTradeDto.prototype, "to", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'BTCUSDT',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], AdminTradeDto.prototype, "symbol", void 0);
exports.AdminTradeDto = AdminTradeDto;
//# sourceMappingURL=admin-trade.dto.js.map