"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionSolTxRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const dex_action_sol_tx_entity_1 = require("../entities/dex-action-sol-tx.entity");
const app_repository_1 = require("../../shares/helpers/app.repository");
let DexActionSolTxRepository = class DexActionSolTxRepository extends app_repository_1.AppRepository {
};
DexActionSolTxRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(dex_action_sol_tx_entity_1.DexActionSolTxEntity)
], DexActionSolTxRepository);
exports.DexActionSolTxRepository = DexActionSolTxRepository;
//# sourceMappingURL=dex-action-sol-txs.repository.js.map