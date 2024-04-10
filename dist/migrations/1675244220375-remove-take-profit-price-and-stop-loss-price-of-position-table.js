"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTakeProfitPriceAndStopLossPriceOfPositionTable1675244220375 = void 0;
class removeTakeProfitPriceAndStopLossPriceOfPositionTable1675244220375 {
    async up(queryRunner) {
        await queryRunner.dropColumn('positions', 'takeProfitPrice');
        await queryRunner.dropColumn('positions', 'stopLossPrice');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('positions', 'takeProfitPrice');
        await queryRunner.dropColumn('positions', 'stopLossPrice');
    }
}
exports.removeTakeProfitPriceAndStopLossPriceOfPositionTable1675244220375 = removeTakeProfitPriceAndStopLossPriceOfPositionTable1675244220375;
//# sourceMappingURL=1675244220375-remove-take-profit-price-and-stop-loss-price-of-position-table.js.map