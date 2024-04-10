"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestSignatureEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let LatestSignatureEntity = class LatestSignatureEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], LatestSignatureEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], LatestSignatureEntity.prototype, "signature", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], LatestSignatureEntity.prototype, "service", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], LatestSignatureEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], LatestSignatureEntity.prototype, "updatedAt", void 0);
LatestSignatureEntity = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'latest_signatures' })
], LatestSignatureEntity);
exports.LatestSignatureEntity = LatestSignatureEntity;
//# sourceMappingURL=latest-signature.entity.js.map