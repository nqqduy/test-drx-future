"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions1637466718378 = void 0;
const transaction_enum_1 = require("../shares/enums/transaction.enum");
const typeorm_1 = require("typeorm");
class transactions1637466718378 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'transactions',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
                {
                    name: 'userId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'accountId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                },
                {
                    name: 'fee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar(20)',
                    isNullable: false,
                    comment: Object.keys(transaction_enum_1.TransactionStatus).join(','),
                },
                {
                    name: 'type',
                    type: 'varchar(20)',
                    isNullable: false,
                    comment: Object.keys(transaction_enum_1.TransactionType).join(','),
                },
                {
                    name: 'txHash',
                    type: 'char',
                    precision: 90,
                    isNullable: true,
                },
                {
                    name: 'logIndex',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
                {
                    name: 'operationId',
                    type: 'bigint',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createIndices('transactions', [
            new typeorm_1.TableIndex({
                columnNames: ['txHash', 'logIndex'],
                isUnique: true,
                name: 'IDX-transactions-txHash-logIndex',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['userId'],
                isUnique: false,
                name: 'IDX-transactions-userId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['accountId', 'type'],
                isUnique: false,
                name: 'IDX-transactions-accountId_type',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['operationId'],
                isUnique: false,
                name: 'IDX-transactions-operationId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['createdAt', 'type', 'accountId'],
                isUnique: false,
                name: 'IDX-transactions-createdAt_type_accountId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['type', 'status'],
                isUnique: false,
                name: 'IDX-transactions-type_status',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('transactions'))
            await queryRunner.dropTable('transactions');
    }
}
exports.transactions1637466718378 = transactions1637466718378;
//# sourceMappingURL=1637466718378-transactions.js.map