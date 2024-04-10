"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dexActionSolTxs1639209748969 = void 0;
const typeorm_1 = require("typeorm");
class dexActionSolTxs1639209748969 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'dex_action_sol_txs',
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
                    name: 'slot',
                    type: 'bigint',
                    unsigned: true,
                },
                {
                    name: 'logs',
                    type: 'text',
                    isNullable: true,
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
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('dex_action_sol_txs')) {
            await queryRunner.dropTable('dex_action_sol_txs');
        }
    }
}
exports.dexActionSolTxs1639209748969 = dexActionSolTxs1639209748969;
//# sourceMappingURL=1639209748969-dex-action-sol-tx.js.map