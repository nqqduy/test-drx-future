"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const tslib_1 = require("tslib");
const account_entity_1 = require("../entities/account.entity");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let AccountRepository = class AccountRepository extends base_repository_1.BaseRepository {
    async getFirstAccountByAddress(address) {
        const result = await this.createQueryBuilder('accounts')
            .select('accounts.*, users.address as address')
            .innerJoin('users', 'users', 'users.id = accounts.id')
            .andWhere('users.address = :address', { address: address })
            .take(1)
            .execute();
        return result.length > 0 ? result[0] : undefined;
    }
    async getAccountsByIds(ids) {
        return this.find({ where: { id: typeorm_1.In(ids) } });
    }
    async getAccountsById(id) {
        return this.findOne({ where: { id } });
    }
};
AccountRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(account_entity_1.AccountEntity)
], AccountRepository);
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=account.repository.js.map