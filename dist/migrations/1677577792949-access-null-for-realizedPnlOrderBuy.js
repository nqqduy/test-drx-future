"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessNullForRealizedPnlOrderBuy1677577792949 = void 0;
const typeorm_1 = require("typeorm");
class accessNullForRealizedPnlOrderBuy1677577792949 {
    async up(queryRunner) {
        await queryRunner.dropColumn('trades', 'realizedPnlOrderBuy');
        await queryRunner.dropColumn('trades', 'realizedPnlOrderSell');
        await queryRunner.addColumns('trades', [
            new typeorm_1.TableColumn({
                name: 'realizedPnlOrderBuy',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'realizedPnlOrderSell',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
        ]);
        await queryRunner.dropColumn('margin_histories', 'positionUnrealisedPnl');
        await queryRunner.dropColumn('margin_histories', 'positionUnrealisedPnlAfter');
        await queryRunner.dropColumn('positions', 'unrealisedPnl');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('positions', 'unrealisedPnl');
    }
}
exports.accessNullForRealizedPnlOrderBuy1677577792949 = accessNullForRealizedPnlOrderBuy1677577792949;
//# sourceMappingURL=1677577792949-access-null-for-realizedPnlOrderBuy.js.map