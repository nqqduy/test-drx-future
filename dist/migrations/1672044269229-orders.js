"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders1672044269229 = void 0;
const typeorm_1 = require("typeorm");
class orders1672044269229 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'takeProfit',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
            new typeorm_1.TableColumn({
                name: 'stopLoss',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'takeProfit');
        await queryRunner.dropColumn('orders', 'stopLoss');
    }
}
exports.orders1672044269229 = orders1672044269229;
//# sourceMappingURL=1672044269229-orders.js.map