"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIsTpSlOrderToOrderTable1678868572167 = void 0;
const typeorm_1 = require("typeorm");
class addIsTpSlOrderToOrderTable1678868572167 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'isTpSlOrder',
                type: 'boolean',
                default: '0',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'isTpSlOrder');
    }
}
exports.addIsTpSlOrderToOrderTable1678868572167 = addIsTpSlOrderToOrderTable1678868572167;
//# sourceMappingURL=1678868572167-add-isTpSlOrder-to-order-table.js.map