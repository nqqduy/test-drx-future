"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const app_repository_1 = require("../../shares/helpers/app.repository");
const dex_action_entity_1 = require("../entities/dex-action-entity");
let DexActionRepository = class DexActionRepository extends app_repository_1.AppRepository {
};
DexActionRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(dex_action_entity_1.DexAction)
], DexActionRepository);
exports.DexActionRepository = DexActionRepository;
//# sourceMappingURL=dex-action.repository.js.map