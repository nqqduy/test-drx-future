"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketFeeEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
const instrument_entity_1 = require("./instrument.entity");
let MarketFeeEntity = class MarketFeeEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], MarketFeeEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], MarketFeeEntity.prototype, "instrumentId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], MarketFeeEntity.prototype, "makerFee", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], MarketFeeEntity.prototype, "takerFee", void 0);
tslib_1.__decorate([
    typeorm_1.OneToOne(() => instrument_entity_1.InstrumentEntity),
    typeorm_1.JoinColumn({ name: 'instrumentId' }),
    tslib_1.__metadata("design:type", instrument_entity_1.InstrumentEntity)
], MarketFeeEntity.prototype, "instrument", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], MarketFeeEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], MarketFeeEntity.prototype, "updatedAt", void 0);
MarketFeeEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'market_fee',
    })
], MarketFeeEntity);
exports.MarketFeeEntity = MarketFeeEntity;
//# sourceMappingURL=market_fee.entity.js.map