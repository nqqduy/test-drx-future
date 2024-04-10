"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStopPriceColumn1673921738894 = void 0;
const typeorm_1 = require("typeorm");
class addStopPriceColumn1673921738894 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'stopPrice',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: null,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'stopPrice');
    }
}
exports.addStopPriceColumn1673921738894 = addStopPriceColumn1673921738894;
//# sourceMappingURL=1673921738894-add-stop-price-column.js.map