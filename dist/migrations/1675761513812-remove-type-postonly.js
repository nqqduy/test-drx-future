"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTypePostonly1675761513812 = void 0;
const order_enum_1 = require("../shares/enums/order.enum");
const typeorm_1 = require("typeorm");
class removeTypePostonly1675761513812 {
    async up(queryRunner) {
        await queryRunner.changeColumn('orders', 'type', new typeorm_1.TableColumn({
            name: 'type',
            type: 'varchar(6)',
            comment: Object.keys(order_enum_1.OrderType).join(','),
            default: `'${order_enum_1.OrderType.LIMIT}'`,
        }));
    }
    async down() { }
}
exports.removeTypePostonly1675761513812 = removeTypePostonly1675761513812;
//# sourceMappingURL=1675761513812-remove-type-postonly.js.map