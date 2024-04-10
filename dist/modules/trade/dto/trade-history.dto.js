"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeHistoryDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TradeHistoryDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1671123600000,
        description: 'Timestamp',
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], TradeHistoryDto.prototype, "startTime", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1681814800000,
        description: 'Timestamp',
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], TradeHistoryDto.prototype, "endTime", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 'BUY',
        enum: ['BUY', 'SELL', 'ALL'],
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], TradeHistoryDto.prototype, "side", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'ADABTC',
        description: 'Get from /api/v1/ticker/24h',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradeHistoryDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
        enum: ['USD_M', 'COIN_M'],
    }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], TradeHistoryDto.prototype, "contractType", void 0);
exports.TradeHistoryDto = TradeHistoryDto;
//# sourceMappingURL=trade-history.dto.js.map