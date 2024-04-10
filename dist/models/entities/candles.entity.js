"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let CandlesEntity = class CandlesEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], CandlesEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], CandlesEntity.prototype, "symbol", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], CandlesEntity.prototype, "low", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], CandlesEntity.prototype, "high", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], CandlesEntity.prototype, "open", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], CandlesEntity.prototype, "close", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], CandlesEntity.prototype, "minute", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], CandlesEntity.prototype, "resolution", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], CandlesEntity.prototype, "volume", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], CandlesEntity.prototype, "lastTradeTime", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], CandlesEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], CandlesEntity.prototype, "updatedAt", void 0);
CandlesEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'candles',
    })
], CandlesEntity);
exports.CandlesEntity = CandlesEntity;
//# sourceMappingURL=candles.entity.js.map