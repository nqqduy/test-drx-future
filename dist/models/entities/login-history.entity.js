"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistoryEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let LoginHistoryEntity = class LoginHistoryEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], LoginHistoryEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], LoginHistoryEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], LoginHistoryEntity.prototype, "ip", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], LoginHistoryEntity.prototype, "device", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], LoginHistoryEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    tslib_1.__metadata("design:type", Date)
], LoginHistoryEntity.prototype, "updatedAt", void 0);
LoginHistoryEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'login_histories',
    })
], LoginHistoryEntity);
exports.LoginHistoryEntity = LoginHistoryEntity;
//# sourceMappingURL=login-history.entity.js.map