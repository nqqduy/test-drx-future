"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrailPriceColumn1677463967925 = void 0;
const typeorm_1 = require("typeorm");
class addTrailPriceColumn1677463967925 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'trailPrice',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: '0',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'trailPrice');
    }
}
exports.addTrailPriceColumn1677463967925 = addTrailPriceColumn1677463967925;
//# sourceMappingURL=1677463967925-add-trail-price-column.js.map