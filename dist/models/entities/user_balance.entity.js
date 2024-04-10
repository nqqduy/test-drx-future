"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBalanceEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let UserBalanceEntity = class UserBalanceEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], UserBalanceEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserBalanceEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserBalanceEntity.prototype, "orderId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], UserBalanceEntity.prototype, "isolateBalance", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], UserBalanceEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], UserBalanceEntity.prototype, "updatedAt", void 0);
UserBalanceEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'user_balance',
    })
], UserBalanceEntity);
exports.UserBalanceEntity = UserBalanceEntity;
//# sourceMappingURL=user_balance.entity.js.map