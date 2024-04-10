"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSTakeProfitPriceAndStopLossPriceToPositionTable1674026721129 = void 0;
const typeorm_1 = require("typeorm");
class addSTakeProfitPriceAndStopLossPriceToPositionTable1674026721129 {
    async up(queryRunner) {
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'takeProfitPrice',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: '0',
            }),
        ]);
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'stopLossPrice',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('positions', 'takeProfitPrice');
        await queryRunner.dropColumn('positions', 'stopLossPrice');
    }
}
exports.addSTakeProfitPriceAndStopLossPriceToPositionTable1674026721129 = addSTakeProfitPriceAndStopLossPriceToPositionTable1674026721129;
//# sourceMappingURL=1674026721129-add-take-profit-price-and-stop-loss-price-to-position-table.js.map