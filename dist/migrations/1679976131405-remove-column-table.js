"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeColumnTable1679976131405 = void 0;
class removeColumnTable1679976131405 {
    async up(queryRunner) {
        await queryRunner.dropColumns('positions', [
            'initMargin',
            'maintainMargin',
            'openOrderMargin',
            'openOrderBuyQty',
            'openOrderSellQty',
            'openOrderBuyValue',
            'openOrderSellValue',
            'openOrderValue',
            'requiredInitMarginPercent',
            'requiredMaintainMarginPercent',
            'maxLiquidationBalance',
            'liquidationOrderId',
            'closedId',
            'closedPrice',
        ]);
        await queryRunner.dropColumns('margin_histories', [
            'initMargin',
            'initMarginAfter',
            'maintainMargin',
            'maintainMarginAfter',
            'openOrderMargin',
            'openOrderMarginAfter',
            'openOrderBuyQty',
            'openOrderSellQty',
            'openOrderBuyValue',
            'openOrderSellValue',
            'openOrderValue',
            'openOrderValueAfter',
            'liquidationOrderId',
            'liquidationOrderIdAfter',
            'crossBalance',
            'crossBalanceAfter',
            'crossMargin',
            'crossMarginAfter',
            'isolatedBalance',
            'isolatedBalanceAfter',
            'maxAvailableBalance',
            'maxAvailableBalanceAfter',
            'orderMargin',
            'orderMarginAfter',
            'extraMargin',
            'extraMarginAfter',
            'latestRealisedPnl',
            'latestRealisedPnlAfter',
            'accountUnrealisedPnl',
            'accountUnrealisedPnlAfter',
            'availableBalance',
            'availableBalanceAfter',
        ]);
        await queryRunner.dropColumns('position_histories', ['initMargin', 'initMarginAfter']);
    }
    async down() { }
}
exports.removeColumnTable1679976131405 = removeColumnTable1679976131405;
//# sourceMappingURL=1679976131405-remove-column-table.js.map