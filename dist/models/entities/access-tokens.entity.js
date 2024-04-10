"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessToken = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const transformer_1 = require("../../shares/helpers/transformer");
const typeorm_1 = require("typeorm");
let AccessToken = class AccessToken {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], AccessToken.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column({
        name: 'token',
        type: 'text',
        nullable: false,
    }),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", String)
], AccessToken.prototype, "token", void 0);
tslib_1.__decorate([
    typeorm_1.Column({
        name: 'user_id',
        type: 'int',
        nullable: false,
    }),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Number)
], AccessToken.prototype, "userId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Boolean)
], AccessToken.prototype, "revoked", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], AccessToken.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], AccessToken.prototype, "updatedAt", void 0);
AccessToken = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'access-tokens',
    })
], AccessToken);
exports.AccessToken = AccessToken;
//# sourceMappingURL=access-tokens.entity.js.map