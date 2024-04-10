"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let MetadataEntity = class MetadataEntity {
};
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    typeorm_1.PrimaryColumn(),
    tslib_1.__metadata("design:type", String)
], MetadataEntity.prototype, "name", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], MetadataEntity.prototype, "data", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], MetadataEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], MetadataEntity.prototype, "updatedAt", void 0);
MetadataEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'metadata',
    })
], MetadataEntity);
exports.MetadataEntity = MetadataEntity;
//# sourceMappingURL=metadata.entity.js.map