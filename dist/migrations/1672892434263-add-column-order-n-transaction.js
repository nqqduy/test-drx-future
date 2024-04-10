"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnOrderNTransaction1672892434263 = void 0;
const typeorm_1 = require("typeorm");
class addColumnOrderNTransaction1672892434263 {
    async up(queryRunner) {
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'asset',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'asset',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('positions', ['asset']);
        await queryRunner.dropColumns('orders', ['asset']);
    }
}
exports.addColumnOrderNTransaction1672892434263 = addColumnOrderNTransaction1672892434263;
//# sourceMappingURL=1672892434263-add-column-order-n-transaction.js.map