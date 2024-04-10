"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderTableForTrailingStop1672909940394 = void 0;
const typeorm_1 = require("typeorm");
class updateOrderTableForTrailingStop1672909940394 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'callbackRate',
                type: 'decimal',
                isNullable: true,
                precision: 22,
                scale: 1,
            }),
            new typeorm_1.TableColumn({
                name: 'activationPrice',
                type: 'decimal',
                isNullable: true,
                precision: 22,
                scale: 8,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'callbackRate');
        await queryRunner.dropColumn('orders', 'activationPrice');
    }
}
exports.updateOrderTableForTrailingStop1672909940394 = updateOrderTableForTrailingStop1672909940394;
//# sourceMappingURL=1672909940394-update-order-table-for-trailing-stop.js.map