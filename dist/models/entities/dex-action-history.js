"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionHistory = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let DexActionHistory = class DexActionHistory {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "txid", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'int' }),
    tslib_1.__metadata("design:type", Number)
], DexActionHistory.prototype, "logIndex", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "address", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", Number)
], DexActionHistory.prototype, "accountId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "action", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "actionId", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "operationId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "validStatus", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "oldMargin", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], DexActionHistory.prototype, "newMargin", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexActionHistory.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], DexActionHistory.prototype, "updatedAt", void 0);
DexActionHistory = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'dex_action_histories' })
], DexActionHistory);
exports.DexActionHistory = DexActionHistory;
//# sourceMappingURL=dex-action-history.js.map