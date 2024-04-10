"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candles1637565543125 = void 0;
const typeorm_1 = require("typeorm");
class candles1637565543125 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'candles',
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
                    name: 'symbol',
                    type: 'varchar(20)',
                    isNullable: false,
                },
                {
                    name: 'minute',
                    type: 'int',
                    unsigned: true,
                    isNullable: false,
                },
                {
                    name: 'resolution',
                    type: 'int',
                    unsigned: true,
                    isNullable: false,
                },
                {
                    name: 'low',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: 'high',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: 'open',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: 'close',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: 'volume',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                    isNullable: false,
                },
                {
                    name: 'lastTradeTime',
                    type: 'int',
                    unsigned: true,
                    isNullable: false,
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
        await queryRunner.createIndices('candles', [
            new typeorm_1.TableIndex({
                columnNames: ['symbol', 'resolution', 'minute'],
                isUnique: true,
                name: 'IDX-candles-symbol_resolution_minute',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('candles')) {
            await queryRunner.dropTable('candles');
        }
    }
}
exports.candles1637565543125 = candles1637565543125;
//# sourceMappingURL=1637565543125-candles.js.map