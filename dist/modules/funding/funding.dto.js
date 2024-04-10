"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketIndex = exports.ImpactPrice = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class ImpactPrice {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], ImpactPrice.prototype, "impactBidPrice", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], ImpactPrice.prototype, "impactAskPrice", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], ImpactPrice.prototype, "interestRate", void 0);
exports.ImpactPrice = ImpactPrice;
class MarketIndex {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], MarketIndex.prototype, "symbol", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], MarketIndex.prototype, "price", void 0);
exports.MarketIndex = MarketIndex;
//# sourceMappingURL=funding.dto.js.map