"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderPostonly1675760760942 = void 0;
const typeorm_1 = require("typeorm");
class orderPostonly1675760760942 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'isPostOnly',
            type: 'boolean',
            default: '0',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'isPostOnly');
    }
}
exports.orderPostonly1675760760942 = orderPostonly1675760760942;
//# sourceMappingURL=1675760760942-order-postonly.js.map