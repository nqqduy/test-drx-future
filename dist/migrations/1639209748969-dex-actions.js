"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dexActions1639209748969 = void 0;
const typeorm_1 = require("typeorm");
class dexActions1639209748969 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'dex_actions',
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
                    name: 'action',
                    type: 'varchar(20)',
                },
                {
                    name: 'actionId',
                    type: 'bigint',
                    unsigned: true,
                },
                {
                    name: 'kafkaOffset',
                    type: 'bigint',
                    unsigned: true,
                },
                {
                    name: 'rawParameter',
                    type: 'json',
                },
                {
                    name: 'dexParameter',
                    type: 'json',
                },
                {
                    name: 'dexActionTransactionId',
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
        await queryRunner.createIndices('dex_actions', [
            new typeorm_1.TableIndex({
                columnNames: ['actionId', 'action'],
                isUnique: true,
                name: 'IDX-dex_actions-actionId_action',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['dexActionTransactionId', 'id'],
                isUnique: true,
                name: 'IDX-dex_actions-dexActionTransactionId_id',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('dex_actions')) {
            await queryRunner.dropTable('dex_actions');
        }
    }
}
exports.dexActions1639209748969 = dexActions1639209748969;
//# sourceMappingURL=1639209748969-dex-actions.js.map