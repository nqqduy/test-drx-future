"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketIndexEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let MarketIndexEntity = class MarketIndexEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], MarketIndexEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], MarketIndexEntity.prototype, "symbol", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], MarketIndexEntity.prototype, "price", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], MarketIndexEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], MarketIndexEntity.prototype, "updatedAt", void 0);
MarketIndexEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'market_indices',
    })
], MarketIndexEntity);
exports.MarketIndexEntity = MarketIndexEntity;
//# sourceMappingURL=market-index.entity.js.map