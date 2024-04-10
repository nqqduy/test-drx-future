"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingRulesModeDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const order_enum_1 = require("../../../shares/enums/order.enum");
class TradingRulesModeDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "minTradeAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "minOrderAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "minPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "limitOrderPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "floorRatio", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "maxMarketOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "limitOrderAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "numberOpenOrders", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "priceProtectionThreshold", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "liqClearanceFee", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "minNotional", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "marketOrderPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ default: false }),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Boolean)
], TradingRulesModeDto.prototype, "isReduceOnly", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "positionsNotional", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "ratioOfPostion", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "liqMarkPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", Number)
], TradingRulesModeDto.prototype, "maxLeverage", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "contractType", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], TradingRulesModeDto.prototype, "maxOrderAmount", void 0);
exports.TradingRulesModeDto = TradingRulesModeDto;
//# sourceMappingURL=trading-rules.dto.js.map