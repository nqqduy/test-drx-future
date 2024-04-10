"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTpSlOrderPosition1676796699158 = void 0;
const typeorm_1 = require("typeorm");
class addTpSlOrderPosition1676796699158 {
    async up(queryRunner) {
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'takeProfitOrderId',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'stopLossOrderId',
                type: 'int',
                unsigned: true,
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('positions', ['takeProfitOrderId', 'stopLossOrderId']);
    }
}
exports.addTpSlOrderPosition1676796699158 = addTpSlOrderPosition1676796699158;
//# sourceMappingURL=1676796699158-add-tp-sl-order-position.js.map