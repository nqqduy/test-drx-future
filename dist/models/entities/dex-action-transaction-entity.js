"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionTransaction = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const dex_constant_1 = require("../../modules/dex/dex.constant");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let DexActionTransaction = class DexActionTransaction {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexActionTransaction.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionTransaction.prototype, "txid", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionTransaction.prototype, "matcherAddress", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexActionTransaction.prototype, "nonce", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionTransaction.prototype, "rawTx", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionTransaction.prototype, "status", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexActionTransaction.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexActionTransaction.prototype, "updatedAt", void 0);
DexActionTransaction = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'dex_action_transactions' })
], DexActionTransaction);
exports.DexActionTransaction = DexActionTransaction;
//# sourceMappingURL=dex-action-transaction-entity.js.map