"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTradingRulesTable1680601120453 = void 0;
class updateTradingRulesTable1680601120453 {
    async up(queryRunner) {
        await queryRunner.renameColumn('trading_rules', 'minOrderPrice', 'minOrderAmount');
        await queryRunner.renameColumn('trading_rules', 'maxOrderPrice', 'maxOrderAmount');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('trading_rules', 'minOrderAmount');
        await queryRunner.dropColumn('trading_rules', 'maxOrderAmount');
    }
}
exports.updateTradingRulesTable1680601120453 = updateTradingRulesTable1680601120453;
//# sourceMappingURL=1680601120453-update-trading-rules-table.js.map