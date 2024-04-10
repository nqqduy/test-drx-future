"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHistoryEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let AccountHistoryEntity = class AccountHistoryEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], AccountHistoryEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], AccountHistoryEntity.prototype, "accountId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], AccountHistoryEntity.prototype, "balance", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], AccountHistoryEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], AccountHistoryEntity.prototype, "updatedAt", void 0);
AccountHistoryEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'account_histories',
    })
], AccountHistoryEntity);
exports.AccountHistoryEntity = AccountHistoryEntity;
//# sourceMappingURL=account-history.entity.js.map