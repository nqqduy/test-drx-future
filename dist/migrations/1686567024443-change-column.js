"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeColumn1686565969240 = void 0;
const typeorm_1 = require("typeorm");
class changeColumn1686565969240 {
    async up(queryRunner) {
        await queryRunner.changeColumn('orders', 'orderMargin', new typeorm_1.TableColumn({
            name: 'orderMargin',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: 0,
        }));
        await queryRunner.changeColumn('positions', 'marBuy', new typeorm_1.TableColumn({
            name: 'marBuy',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: 0,
        }));
        await queryRunner.changeColumn('positions', 'marSel', new typeorm_1.TableColumn({
            name: 'marSel',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: 0,
        }));
        await queryRunner.changeColumn('positions', 'orderCost', new typeorm_1.TableColumn({
            name: 'orderCost',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: 0,
        }));
        await queryRunner.changeColumn('positions', 'positionMargin', new typeorm_1.TableColumn({
            name: 'positionMargin',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: 0,
        }));
    }
    async down() { }
}
exports.changeColumn1686565969240 = changeColumn1686565969240;
//# sourceMappingURL=1686567024443-change-column.js.map