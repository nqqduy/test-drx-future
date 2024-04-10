"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParentOrderIdColumn1677059064231 = void 0;
const typeorm_1 = require("typeorm");
class addParentOrderIdColumn1677059064231 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'parentOrderId',
            type: 'int',
            unsigned: true,
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'parentOrderId');
    }
}
exports.addParentOrderIdColumn1677059064231 = addParentOrderIdColumn1677059064231;
//# sourceMappingURL=1677059064231-add-parent-order-id-column.js.map