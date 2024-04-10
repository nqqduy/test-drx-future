"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionHistoryRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const app_repository_1 = require("../../shares/helpers/app.repository");
const dex_action_history_1 = require("../entities/dex-action-history");
let DexActionHistoryRepository = class DexActionHistoryRepository extends app_repository_1.AppRepository {
};
DexActionHistoryRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(dex_action_history_1.DexActionHistory)
], DexActionHistoryRepository);
exports.DexActionHistoryRepository = DexActionHistoryRepository;
//# sourceMappingURL=dex-action-history-repository.js.map