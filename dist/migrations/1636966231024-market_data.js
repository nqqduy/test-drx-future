"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketData1636966231024 = void 0;
const typeorm_1 = require("typeorm");
class marketData1636966231024 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'market_data',
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
                    name: 'market',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'symbol',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'group',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'bid',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'ask',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'index',
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
        }));
        await queryRunner.createIndices('market_data', [
            new typeorm_1.TableIndex({
                columnNames: ['createdAt'],
                isUnique: false,
                name: 'IDX-market_data-createdAt',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['group', 'market'],
                isUnique: false,
                name: 'IDX-market_data-group_market',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('market_data')) {
            await queryRunner.dropTable('market_data');
        }
    }
}
exports.marketData1636966231024 = marketData1636966231024;
//# sourceMappingURL=1636966231024-market_data.js.map