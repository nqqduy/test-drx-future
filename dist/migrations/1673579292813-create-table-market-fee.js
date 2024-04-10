"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableMarketFee1673579292813 = void 0;
const typeorm_1 = require("typeorm");
class createTableMarketFee1673579292813 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'market_fee',
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
                    unsigned: true,
                    default: null,
                },
                {
                    name: 'makerFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'takerFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
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
        if (await queryRunner.hasTable('market_fee'))
            await queryRunner.dropTable('market_fee');
    }
}
exports.createTableMarketFee1673579292813 = createTableMarketFee1673579292813;
//# sourceMappingURL=1673579292813-create-table-market-fee.js.map