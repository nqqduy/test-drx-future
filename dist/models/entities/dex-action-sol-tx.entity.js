"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionSolTxEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let DexActionSolTxEntity = class DexActionSolTxEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexActionSolTxEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], DexActionSolTxEntity.prototype, "txid", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], DexActionSolTxEntity.prototype, "slot", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], DexActionSolTxEntity.prototype, "logs", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexActionSolTxEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexActionSolTxEntity.prototype, "updatedAt", void 0);
DexActionSolTxEntity = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'dex_action_sol_txs' })
], DexActionSolTxEntity);
exports.DexActionSolTxEntity = DexActionSolTxEntity;
//# sourceMappingURL=dex-action-sol-tx.entity.js.map