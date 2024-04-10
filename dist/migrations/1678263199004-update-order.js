"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder1678263199004 = void 0;
const order_entity_1 = require("../models/entities/order.entity");
class updateOrder1678263199004 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE orders AUTO_INCREMENT = ${order_entity_1.MIN_ORDER_ID};`);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('orders'))
            await queryRunner.dropTable('orders');
    }
}
exports.updateOrder1678263199004 = updateOrder1678263199004;
//# sourceMappingURL=1678263199004-update-order.js.map