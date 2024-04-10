"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumn1686537555051 = void 0;
const typeorm_1 = require("typeorm");
class addColumn1686537555051 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'orderMargin',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
        ]);
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'marBuy',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
            new typeorm_1.TableColumn({
                name: 'marSel',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
            new typeorm_1.TableColumn({
                name: 'orderCost',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
            new typeorm_1.TableColumn({
                name: 'positionMargin',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'orderMargin');
        await queryRunner.dropColumns('positions', ['marBuy', 'marSel', 'orderCost', 'positionMargin']);
    }
}
exports.addColumn1686537555051 = addColumn1686537555051;
//# sourceMappingURL=1686537555051-add-column.js.map