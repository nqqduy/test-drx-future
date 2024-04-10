"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestBlockEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let LatestBlockEntity = class LatestBlockEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], LatestBlockEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], LatestBlockEntity.prototype, "blockNumber", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], LatestBlockEntity.prototype, "status", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], LatestBlockEntity.prototype, "service", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], LatestBlockEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], LatestBlockEntity.prototype, "updatedAt", void 0);
LatestBlockEntity = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'latest_blocks' })
], LatestBlockEntity);
exports.LatestBlockEntity = LatestBlockEntity;
//# sourceMappingURL=latest-block.entity.js.map