"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexOrder1686190261357 = void 0;
const typeorm_1 = require("typeorm");
class createIndexOrder1686190261357 {
    async up(queryRunner) {
        await queryRunner.createIndices('orders', [
            new typeorm_1.TableIndex({
                columnNames: ['userId', 'status', 'symbol'],
                isUnique: false,
                name: 'IDX-orders-userId-status-symbol',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['createdAt'],
                isUnique: false,
                name: 'IDX-orders-createdAt',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('orders'))
            await queryRunner.dropTable('orders');
    }
}
exports.createIndexOrder1686190261357 = createIndexOrder1686190261357;
//# sourceMappingURL=1686190261357-create-index-order.js.map