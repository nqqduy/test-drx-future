"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRealizedPnlToTradeTables1677491255064 = void 0;
const typeorm_1 = require("typeorm");
class addRealizedPnlToTradeTables1677491255064 {
    async up(queryRunner) {
        await queryRunner.addColumns('trades', [
            new typeorm_1.TableColumn({
                name: 'realizedPnlOrderBuy',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
            new typeorm_1.TableColumn({
                name: 'realizedPnlOrderSell',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('trades', 'realizedPnlOrderBuy');
        await queryRunner.dropColumn('trades', 'realizedPnlOrderSell');
    }
}
exports.addRealizedPnlToTradeTables1677491255064 = addRealizedPnlToTradeTables1677491255064;
//# sourceMappingURL=1677491255064-add-realizedPnl-to-trade-tables.js.map