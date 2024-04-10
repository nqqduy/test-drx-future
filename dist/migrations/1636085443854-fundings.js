"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundings1636085443854 = void 0;
const typeorm_1 = require("typeorm");
class fundings1636085443854 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'fundings',
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
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'time',
                    type: 'datetime',
                    isNullable: false,
                },
                {
                    name: 'fundingInterval',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'fundingRateDaily',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'fundingRate',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'oraclePrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'paid',
                    type: 'boolean',
                    isNullable: false,
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
        await queryRunner.createIndices('fundings', [
            new typeorm_1.TableIndex({
                columnNames: ['symbol', 'time'],
                isUnique: true,
                name: 'IDX-fundings-symbol_time',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('fundings'))
            await queryRunner.dropTable('fundings');
    }
}
exports.fundings1636085443854 = fundings1636085443854;
//# sourceMappingURL=1636085443854-fundings.js.map