"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trades1622601579366 = void 0;
const typeorm_1 = require("typeorm");
class trades1622601579366 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'trades',
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
                    name: 'buyOrderId',
                    type: 'bigint',
                    unsigned: true,
                },
                {
                    name: 'sellOrderId',
                    type: 'bigint',
                    unsigned: true,
                },
                {
                    name: 'buyAccountId',
                    type: 'bigint',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'sellAccountId',
                    type: 'bigint',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'instrumentSymbol',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'quantity',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'buyFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'sellFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'buyerIsTaker',
                    type: 'boolean',
                    default: 0,
                },
                {
                    name: 'note',
                    type: 'varchar(30)',
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
        }), true);
        await queryRunner.createIndices('trades', [
            new typeorm_1.TableIndex({
                columnNames: ['instrumentSymbol', 'sellAccountId'],
                isUnique: false,
                name: 'IDX-trades-instrumentSymbol_sellAccountId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['instrumentSymbol', 'buyAccountId'],
                isUnique: false,
                name: 'IDX-trades-instrumentSymbol_buyAccountId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['sellAccountId'],
                isUnique: false,
                name: 'IDX-trades-sellAccountId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['buyAccountId'],
                isUnique: false,
                name: 'IDX-trades-buyAccountId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['instrumentSymbol', 'createdAt'],
                isUnique: false,
                name: 'IDX-trades-instrumentSymbol_createdAt',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('trades'))
            await queryRunner.dropTable('trades');
    }
}
exports.trades1622601579366 = trades1622601579366;
//# sourceMappingURL=1622601579366-trades.js.map