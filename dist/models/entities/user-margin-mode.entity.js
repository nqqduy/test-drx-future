"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMarginModeEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const order_enum_1 = require("../../shares/enums/order.enum");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let UserMarginModeEntity = class UserMarginModeEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], UserMarginModeEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserMarginModeEntity.prototype, "userId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], UserMarginModeEntity.prototype, "instrumentId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], UserMarginModeEntity.prototype, "marginMode", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], UserMarginModeEntity.prototype, "leverage", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], UserMarginModeEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], UserMarginModeEntity.prototype, "updatedAt", void 0);
UserMarginModeEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'user_margin_mode',
    })
], UserMarginModeEntity);
exports.UserMarginModeEntity = UserMarginModeEntity;
//# sourceMappingURL=user-margin-mode.entity.js.map