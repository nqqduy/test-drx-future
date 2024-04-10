"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let ApiKey = class ApiKey {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], ApiKey.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ type: 'bigint' }),
    tslib_1.__metadata("design:type", String)
], ApiKey.prototype, "userId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], ApiKey.prototype, "key", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], ApiKey.prototype, "type", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], ApiKey.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], ApiKey.prototype, "updatedAt", void 0);
ApiKey = tslib_1.__decorate([
    typeorm_1.Entity({ name: 'api_keys' })
], ApiKey);
exports.ApiKey = ApiKey;
//# sourceMappingURL=api-key.entity.js.map