"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let UserSettingEntity = class UserSettingEntity {
};
UserSettingEntity.NOTIFICATION = 'NOTIFICATION';
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], UserSettingEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserSettingEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], UserSettingEntity.prototype, "key", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "limitOrder", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "marketOrder", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "stopLimitOrder", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "stopMarketOrder", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "traillingStopOrder", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "takeProfitTrigger", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "stopLossTrigger", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserSettingEntity.prototype, "fundingFeeTriggerValue", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "fundingFeeTrigger", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], UserSettingEntity.prototype, "isFavorite", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Date)
], UserSettingEntity.prototype, "time", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserSettingEntity.prototype, "notificationQuantity", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], UserSettingEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], UserSettingEntity.prototype, "updatedAt", void 0);
UserSettingEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'user_settings',
    })
], UserSettingEntity);
exports.UserSettingEntity = UserSettingEntity;
//# sourceMappingURL=user-setting.entity.js.map