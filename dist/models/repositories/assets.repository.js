"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const assets_entity_1 = require("../entities/assets.entity");
const typeorm_transactional_cls_hooked_1 = require("typeorm-transactional-cls-hooked");
let AssetsRepository = class AssetsRepository extends typeorm_transactional_cls_hooked_1.BaseRepository {
};
AssetsRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(assets_entity_1.AssetsEntity)
], AssetsRepository);
exports.AssetsRepository = AssetsRepository;
//# sourceMappingURL=assets.repository.js.map