"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNullable1689579799298 = void 0;
const typeorm_1 = require("typeorm");
class setNullable1689579799298 {
    async up(queryRunner) {
        await queryRunner.changeColumn('orders', 'cost', new typeorm_1.TableColumn({
            name: 'cost',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: false,
            default: '0',
        }));
        await queryRunner.changeColumn('orders', 'originalCost', new typeorm_1.TableColumn({
            name: 'originalCost',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: false,
            default: '0',
        }));
        await queryRunner.changeColumn('orders', 'originalOrderMargin', new typeorm_1.TableColumn({
            name: 'originalOrderMargin',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: false,
            default: '0',
        }));
        await queryRunner.changeColumn('orders', 'orderMargin', new typeorm_1.TableColumn({
            name: 'orderMargin',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: false,
            default: '0',
        }));
    }
    async down() { }
}
exports.setNullable1689579799298 = setNullable1689579799298;
//# sourceMappingURL=1689579799298-set-nullable.js.map