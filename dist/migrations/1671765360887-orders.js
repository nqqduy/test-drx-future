"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders1671765360887 = void 0;
const typeorm_1 = require("typeorm");
class orders1671765360887 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'takeProfitOrderId',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'stopLossOrderId',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'takeProfitOrderId');
        await queryRunner.dropColumn('orders', 'stopLossOrderId');
    }
}
exports.orders1671765360887 = orders1671765360887;
//# sourceMappingURL=1671765360887-orders.js.map