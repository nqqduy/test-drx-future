"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderTable1672384828737 = void 0;
const order_enum_1 = require("../shares/enums/order.enum");
const typeorm_1 = require("typeorm");
class updateOrderTable1672384828737 {
    async up(queryRunner) {
        await queryRunner.dropColumn('orders', 'isPostOnly');
        await queryRunner.dropColumn('orders', 'isHidden');
        await queryRunner.dropColumn('orders', 'unrealisedPnl');
        await queryRunner.dropColumn('orders', 'takeProfit');
        await queryRunner.dropColumn('orders', 'stopLoss');
        await queryRunner.changeColumn('orders', 'instrumentSymbol', new typeorm_1.TableColumn({
            name: 'symbol',
            type: 'varchar(20)',
            isNullable: true,
        }));
        await queryRunner.changeColumn('orders', 'stopType', new typeorm_1.TableColumn({
            name: 'tpSlType',
            type: 'varchar(20)',
            isNullable: true,
            comment: Object.keys(order_enum_1.TpSlType).join(','),
        }));
        await queryRunner.changeColumn('orders', 'stopPrice', new typeorm_1.TableColumn({
            name: 'tpSlPrice',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: null,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'symbol');
    }
}
exports.updateOrderTable1672384828737 = updateOrderTable1672384828737;
//# sourceMappingURL=1672384828737-update-order-table.js.map