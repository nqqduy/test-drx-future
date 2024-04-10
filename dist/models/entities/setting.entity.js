"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let SettingEntity = class SettingEntity {
};
SettingEntity.MINIMUM_WITHDRAWAL = 'MINIMUM_WITHDRAWAL';
SettingEntity.WITHDRAW_FEE = 'WITHDRAW_FEE';
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], SettingEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "key", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], SettingEntity.prototype, "value", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], SettingEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], SettingEntity.prototype, "updatedAt", void 0);
SettingEntity = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'settings' })
], SettingEntity);
exports.SettingEntity = SettingEntity;
//# sourceMappingURL=setting.entity.js.map