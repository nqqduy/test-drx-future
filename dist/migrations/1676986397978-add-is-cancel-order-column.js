"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIsCancelOrderColumn1676986397978 = void 0;
const typeorm_1 = require("typeorm");
class addIsCancelOrderColumn1676986397978 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'isClosePositionOrder',
            type: 'boolean',
            default: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'isClosePositionOrder');
    }
}
exports.addIsCancelOrderColumn1676986397978 = addIsCancelOrderColumn1676986397978;
//# sourceMappingURL=1676986397978-add-is-cancel-order-column.js.map