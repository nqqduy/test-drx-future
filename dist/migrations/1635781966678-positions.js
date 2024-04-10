"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positions1635781966678 = void 0;
const typeorm_1 = require("typeorm");
class positions1635781966678 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'positions',
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
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'ownerEmail',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'managerEmail',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'symbol',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'leverage',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'unrealisedPnl',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'currentQty',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'riskLimit',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'riskValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'initMargin',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'maintainMargin',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'extraMargin',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'requiredInitMarginPercent',
                    type: 'decimal',
                    precision: 30,
                    scale: 10,
                    default: 0,
                },
                {
                    name: 'requiredMaintainMarginPercent',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'liquidationPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'bankruptPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'entryPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'entryValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'openOrderBuyQty',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'openOrderSellQty',
                    type: 'decimal',
                    precision: 30,
                    scale: 10,
                    default: 0,
                },
                {
                    name: 'openOrderBuyValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'openOrderSellValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'openOrderValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'openOrderMargin',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'multiplier',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'liquidationProgress',
                    type: 'tinyint',
                    default: 0,
                },
                {
                    name: 'liquidationOrderId',
                    type: 'bigint',
                    unsigned: true,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'maxLiquidationBalance',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'isCross',
                    type: 'boolean',
                    default: 0,
                },
                {
                    name: 'realisedPnl',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: '0',
                },
                {
                    name: 'latestRealisedPnl',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: '0',
                },
                {
                    name: 'netFunding',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: '0',
                },
                {
                    name: 'pnlRanking',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'closedId',
                    type: 'bigint',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'closedPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: null,
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
        await queryRunner.createIndices('positions', [
            new typeorm_1.TableIndex({
                columnNames: ['accountId'],
                isUnique: false,
                name: 'IDX-positions-accountId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['liquidationProgress'],
                isUnique: false,
                name: 'IDX-positions-liquidationProgress',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('positions'))
            await queryRunner.dropTable('positions');
    }
}
exports.positions1635781966678 = positions1635781966678;
//# sourceMappingURL=1635781966678-positions.js.map