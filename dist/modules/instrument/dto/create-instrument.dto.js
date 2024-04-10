"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContractDto = exports.ContractListDto = exports.ContractDto = exports.CreateLeverageMarginDto = exports.CreateTradingRuleDto = exports.CreateInstrumentDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shares/dtos/pagination.dto");
const order_enum_1 = require("../../../shares/enums/order.enum");
class CreateInstrumentDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "rootSymbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "contractType", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "underlyingSymbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "makerFee", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "takerFee", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "tickSize", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "maxPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "minPriceMovement", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "maxFiguresForSize", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "maxFiguresForPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "impactMarginNotional", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateInstrumentDto.prototype, "multiplier", void 0);
exports.CreateInstrumentDto = CreateInstrumentDto;
class CreateTradingRuleDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "minPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "limitOrderPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "floorRatio", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "minOrderAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "maxOrderAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "minNotional", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "maxNotinal", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateTradingRuleDto.prototype, "liqClearanceFee", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateTradingRuleDto.prototype, "maxLeverage", void 0);
exports.CreateTradingRuleDto = CreateTradingRuleDto;
class CreateLeverageMarginDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateLeverageMarginDto.prototype, "min", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateLeverageMarginDto.prototype, "max", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateLeverageMarginDto.prototype, "maxLeverage", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateLeverageMarginDto.prototype, "maintenanceMarginRate", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateLeverageMarginDto.prototype, "maintenanceAmount", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], CreateLeverageMarginDto.prototype, "contractType", void 0);
exports.CreateLeverageMarginDto = CreateLeverageMarginDto;
class ContractDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", CreateInstrumentDto)
], ContractDto.prototype, "instrument", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", CreateTradingRuleDto)
], ContractDto.prototype, "tradingRules", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        example: [
            {
                min: 1,
                max: 1,
                maxLeverage: 1,
                maintenanceMarginRate: 1,
                maintenanceAmount: 1,
            },
        ],
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Array)
], ContractDto.prototype, "leverageMargin", void 0);
exports.ContractDto = ContractDto;
class ContractListDto extends pagination_dto_1.PaginationDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: false }),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], ContractListDto.prototype, "search", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], ContractListDto.prototype, "contractType", void 0);
exports.ContractListDto = ContractListDto;
class UpdateContractDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], UpdateContractDto.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], UpdateContractDto.prototype, "symbol", void 0);
exports.UpdateContractDto = UpdateContractDto;
//# sourceMappingURL=create-instrument.dto.js.map