"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accounts1635785330158 = void 0;
const typeorm_1 = require("typeorm");
class accounts1635785330158 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'accounts',
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
                    name: 'usdtBalance',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'usdtAvailableBalance',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'usdBalance',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'usdAvailableBalance',
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
        await queryRunner.createIndices('accounts', [
            new typeorm_1.TableIndex({
                columnNames: ['usdtBalance'],
                isUnique: false,
                name: 'IDX-accounts-usdtBalance',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['usdtAvailableBalance'],
                isUnique: false,
                name: 'IDX-accounts-usdtAvailableBalance',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['usdBalance'],
                isUnique: false,
                name: 'IDX-accounts-usdBalance',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['usdAvailableBalance'],
                isUnique: false,
                name: 'IDX-accounts-usdAvailableBalance',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('accounts'))
            await queryRunner.dropTable('accounts');
    }
}
exports.accounts1635785330158 = accounts1635785330158;
//# sourceMappingURL=1635785330158-accounts.js.map