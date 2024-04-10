"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
let ConfigEntity = class ConfigEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], ConfigEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], ConfigEntity.prototype, "key", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], ConfigEntity.prototype, "value", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Date)
], ConfigEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Date)
], ConfigEntity.prototype, "updatedAt", void 0);
ConfigEntity = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'settings' })
], ConfigEntity);
exports.ConfigEntity = ConfigEntity;
//# sourceMappingURL=config.entity.js.map