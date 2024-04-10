"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOriginalCostOriginalOrderMargin1687166202995 = void 0;
const typeorm_1 = require("typeorm");
class addOriginalCostOriginalOrderMargin1687166202995 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'originalCost',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'originalOrderMargin',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('orders', ['originalCost', 'originalOrderMargin']);
    }
}
exports.addOriginalCostOriginalOrderMargin1687166202995 = addOriginalCostOriginalOrderMargin1687166202995;
//# sourceMappingURL=1687166202995-add-originalCost-originalOrderMargin.js.map