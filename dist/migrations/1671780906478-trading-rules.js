"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradingRules1671780906478 = void 0;
const typeorm_1 = require("typeorm");
class tradingRules1671780906478 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'trading_rules',
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
                    name: 'instrumentId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'minTradeAmount',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'minOrderPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'minPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'limitOrderPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'floorRatio',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'maxMarketOrder',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'limitOrderAmount',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'numberOpenOrders',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'priceProtectionThreshold',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'liqClearanceFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'minNotional',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'marketOrderPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'isReduceOnly',
                    type: 'boolean',
                    default: '0',
                },
                {
                    name: 'positionsNotional',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'ratioOfPostion',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'liqMarkPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
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
        await queryRunner.createIndices('trading_rules', [
            new typeorm_1.TableIndex({
                columnNames: ['instrumentId'],
                isUnique: false,
                name: 'IDX-trading_rules-instrumentId',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('trading_rules')) {
            await queryRunner.dropTable('trading_rules');
        }
    }
}
exports.tradingRules1671780906478 = tradingRules1671780906478;
//# sourceMappingURL=1671780906478-trading-rules.js.map