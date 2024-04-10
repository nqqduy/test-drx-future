"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let AssetsEntity = class AssetsEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], AssetsEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AssetsEntity.prototype, "asset", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], AssetsEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], AssetsEntity.prototype, "updatedAt", void 0);
AssetsEntity = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'assets' })
], AssetsEntity);
exports.AssetsEntity = AssetsEntity;
//# sourceMappingURL=assets.entity.js.map