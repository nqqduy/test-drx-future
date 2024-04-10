"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountHistories1638084692774 = void 0;
const typeorm_1 = require("typeorm");
class accountHistories1638084692774 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'account_histories',
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
                    name: 'accountId',
                    type: 'bigint',
                },
                {
                    name: 'balance',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
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
        await queryRunner.createIndices('account_histories', [
            new typeorm_1.TableIndex({
                columnNames: ['accountId', 'createdAt'],
                isUnique: true,
                name: 'IDX-account_histories-accountId_createdAt',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('account_histories');
    }
}
exports.accountHistories1638084692774 = accountHistories1638084692774;
//# sourceMappingURL=1638084692774-account_histories.js.map