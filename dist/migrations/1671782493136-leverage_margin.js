"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leverageMargin1671782493136 = void 0;
const typeorm_1 = require("typeorm");
class leverageMargin1671782493136 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'leverage_margin',
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
                    name: 'tier',
                    type: 'int',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'instrumentId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'min',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'max',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'maxLeverage',
                    type: 'int',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'maintenanceMarginRate',
                    type: 'int',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'maintenanceAmount',
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
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('leverage_margin'))
            await queryRunner.dropTable('leverage_margin');
    }
}
exports.leverageMargin1671782493136 = leverageMargin1671782493136;
//# sourceMappingURL=1671782493136-leverage_margin.js.map