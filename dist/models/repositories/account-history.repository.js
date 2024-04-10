"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHistoryRepository = void 0;
const tslib_1 = require("tslib");
const account_history_entity_1 = require("../entities/account-history.entity");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let AccountHistoryRepository = class AccountHistoryRepository extends base_repository_1.BaseRepository {
    getAccountBalanceFromTo(accountId, from, to) {
        return this.find({
            accountId: accountId,
            createdAt: typeorm_1.In([from, to]),
        });
    }
    async batchSave(entities) {
        if (entities.length == 0) {
            return;
        }
        const placeHolders = entities.map(() => '(?, ?)').join(',');
        let sql = '';
        sql += 'INSERT INTO `account_histories` (`accountId`,`balance`)';
        sql += ` VALUES ${placeHolders}`;
        const params = [];
        for (const entity of entities) {
            params.push(entity.accountId);
            params.push(entity.balance);
        }
        await this.manager.query(sql, params);
    }
};
AccountHistoryRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(account_history_entity_1.AccountHistoryEntity)
], AccountHistoryRepository);
exports.AccountHistoryRepository = AccountHistoryRepository;
//# sourceMappingURL=account-history.repository.js.map