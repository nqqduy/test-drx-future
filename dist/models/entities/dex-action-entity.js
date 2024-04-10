"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexAction = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let DexAction = class DexAction {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexAction.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexAction.prototype, "action", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexAction.prototype, "actionId", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexAction.prototype, "kafkaOffset", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'json' }),
    tslib_1.__metadata("design:type", Object)
], DexAction.prototype, "rawParameter", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'json' }),
    tslib_1.__metadata("design:type", Object)
], DexAction.prototype, "dexParameter", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexAction.prototype, "dexActionTransactionId", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexAction.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexAction.prototype, "updatedAt", void 0);
DexAction = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'dex_actions' })
], DexAction);
exports.DexAction = DexAction;
//# sourceMappingURL=dex-action-entity.js.map