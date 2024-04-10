"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBalance1671178717886 = void 0;
const typeorm_1 = require("typeorm");
class userBalance1671178717886 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user_balance',
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
                    name: 'orderId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'isolateBalance',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
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
        }), true);
        await queryRunner.createIndices('user_balance', [
            new typeorm_1.TableIndex({
                columnNames: ['userId'],
                isUnique: false,
                name: 'IDX-user_balance-userId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['orderId'],
                isUnique: false,
                name: 'IDX-user_balance-orderId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['isolateBalance'],
                isUnique: true,
                name: 'IDX-user_balance-isolateBalance',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('user_balance')) {
            await queryRunner.dropTable('user_balance');
        }
    }
}
exports.userBalance1671178717886 = userBalance1671178717886;
//# sourceMappingURL=1671178717886-user_balance.js.map