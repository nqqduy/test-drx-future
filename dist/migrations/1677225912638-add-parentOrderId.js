"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParentOrderId1677225912638 = void 0;
const typeorm_1 = require("typeorm");
class addParentOrderId1677225912638 {
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
exports.addParentOrderId1677225912638 = addParentOrderId1677225912638;
//# sourceMappingURL=1677225912638-add-parentOrderId.js.map