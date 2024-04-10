"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfoEntity = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const transformer_1 = require("../../shares/helpers/transformer");
let CoinInfoEntity = class CoinInfoEntity {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    tslib_1.__metadata("design:type", Number)
], CoinInfoEntity.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "fullName", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ unique: true }),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "baseId", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "symbol", void 0);
tslib_1.__decorate([
    typeorm_1.Column({ unsigned: true }),
    tslib_1.__metadata("design:type", Number)
], CoinInfoEntity.prototype, "rank", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "marketCap", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "cirSupply", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "maxSupply", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "totalSupply", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], CoinInfoEntity.prototype, "issueDate", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "issuePrice", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "explorer", void 0);
tslib_1.__decorate([
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], CoinInfoEntity.prototype, "coin_image", void 0);
tslib_1.__decorate([
    typeorm_1.CreateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], CoinInfoEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    typeorm_1.UpdateDateColumn(),
    class_transformer_1.Transform(transformer_1.dateTransformer),
    tslib_1.__metadata("design:type", Date)
], CoinInfoEntity.prototype, "updatedAt", void 0);
CoinInfoEntity = tslib_1.__decorate([
    typeorm_1.Entity({
        name: 'coin_info',
    })
], CoinInfoEntity);
exports.CoinInfoEntity = CoinInfoEntity;
//# sourceMappingURL=coin-info.entity.js.map