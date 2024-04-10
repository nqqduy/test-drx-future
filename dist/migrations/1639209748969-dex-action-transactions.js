"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dexActionTransactions1639209748969 = void 0;
const typeorm_1 = require("typeorm");
class dexActionTransactions1639209748969 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'dex_action_transactions',
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
                    name: 'txid',
                    type: 'char',
                    precision: 90,
                    isUnique: true,
                },
                {
                    name: 'matcherAddress',
                    type: 'char',
                    precision: 50,
                },
                {
                    name: 'nonce',
                    type: 'bigint',
                    unsigned: true,
                },
                {
                    name: 'status',
                    type: 'varchar(20)',
                    default: "'PENDING'",
                },
                {
                    name: 'rawTx',
                    type: 'mediumtext',
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
        await queryRunner.createIndices('dex_action_transactions', [
            new typeorm_1.TableIndex({
                columnNames: ['matcherAddress', 'nonce'],
                isUnique: true,
                name: 'IDX-dex_action_transactions-matcherAddress_nonce',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['status'],
                isUnique: false,
                name: 'IDX-dex_action_transactions-status',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('dex_action_transactions')) {
            await queryRunner.dropTable('dex_action_transactions');
        }
    }
}
exports.dexActionTransactions1639209748969 = dexActionTransactions1639209748969;
//# sourceMappingURL=1639209748969-dex-action-transactions.js.map