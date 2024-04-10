"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexActionTransactionRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const app_repository_1 = require("../../shares/helpers/app.repository");
const dex_action_transaction_entity_1 = require("../entities/dex-action-transaction-entity");
let DexActionTransactionRepository = class DexActionTransactionRepository extends app_repository_1.AppRepository {
};
DexActionTransactionRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(dex_action_transaction_entity_1.DexActionTransaction)
], DexActionTransactionRepository);
exports.DexActionTransactionRepository = DexActionTransactionRepository;
//# sourceMappingURL=dex-action-transaction.repository.js.map