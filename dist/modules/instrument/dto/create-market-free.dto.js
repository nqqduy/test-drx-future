"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarketFeeDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateMarketFeeDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateMarketFeeDto.prototype, "instrumentId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateMarketFeeDto.prototype, "makerFee", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateMarketFeeDto.prototype, "takerFee", void 0);
exports.CreateMarketFeeDto = CreateMarketFeeDto;
//# sourceMappingURL=create-market-free.dto.js.map