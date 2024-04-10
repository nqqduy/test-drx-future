"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const tslib_1 = require("tslib");
const transaction_entity_1 = require("../entities/transaction.entity");
const base_repository_1 = require("./base.repository");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const typeorm_1 = require("typeorm");
let TransactionRepository = class TransactionRepository extends base_repository_1.BaseRepository {
    async findRecentDeposits(date, fromId, count) {
        return this.createQueryBuilder()
            .where('id > :fromId', { fromId })
            .andWhere('createdAt >= :createdAt', { createdAt: date })
            .andWhere('type = :type', { type: transaction_enum_1.TransactionType.DEPOSIT })
            .orderBy('createdAt', 'ASC')
            .take(count)
            .getMany();
    }
    async findPendingWithdrawals(fromId, count) {
        return this.createQueryBuilder()
            .where('id > :fromId', { fromId })
            .andWhere('type = :type', { type: transaction_enum_1.TransactionType.WITHDRAWAL })
            .andWhere('status = :status', { status: transaction_enum_1.TransactionStatus.PENDING })
            .orderBy('id', 'ASC')
            .take(count)
            .getMany();
    }
};
TransactionRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(transaction_entity_1.TransactionEntity)
], TransactionRepository);
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map