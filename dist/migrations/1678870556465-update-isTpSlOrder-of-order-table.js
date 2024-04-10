"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIsTpSlOrderOfOrderTable1678870556465 = void 0;
const typeorm_1 = require("typeorm");
class updateIsTpSlOrderOfOrderTable1678870556465 {
    async up(queryRunner) {
        await queryRunner.changeColumn('orders', 'isTpSlOrder', new typeorm_1.TableColumn({
            name: 'isTpSlOrder',
            type: 'boolean',
            default: '0',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'isTpSlOrder');
    }
}
exports.updateIsTpSlOrderOfOrderTable1678870556465 = updateIsTpSlOrderOfOrderTable1678870556465;
//# sourceMappingURL=1678870556465-update-isTpSlOrder-of-order-table.js.map