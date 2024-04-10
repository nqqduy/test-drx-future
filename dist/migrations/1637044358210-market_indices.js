"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketIndice1637044358210 = void 0;
const typeorm_1 = require("typeorm");
class marketIndice1637044358210 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'market_indices',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
                {
                    name: 'symbol',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'price',
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
        await queryRunner.createIndices('market_indices', [
            new typeorm_1.TableIndex({
                columnNames: ['createdAt'],
                isUnique: false,
                name: 'IDX-market_indices-createdAt',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['symbol'],
                isUnique: false,
                name: 'IDX-market_indices-symbol',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('market_indices')) {
            await queryRunner.dropTable('market_indices');
        }
    }
}
exports.marketIndice1637044358210 = marketIndice1637044358210;
//# sourceMappingURL=1637044358210-market_indices.js.map