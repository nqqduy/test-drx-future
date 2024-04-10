"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alterTable1677479991430 = void 0;
const typeorm_1 = require("typeorm");
class alterTable1677479991430 {
    async up(queryRunner) {
        await queryRunner.dropColumns('positions', ['riskValue', 'riskLimit']);
        await queryRunner.dropColumns('margin_histories', ['riskLimit', 'riskLimitAfter', 'riskValue', 'riskValueAfter']);
        await queryRunner.dropColumns('instruments', ['riskLimit']);
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'cost',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
            default: null,
        }));
    }
    async down() { }
}
exports.alterTable1677479991430 = alterTable1677479991430;
//# sourceMappingURL=1677479991430-alter-table.js.map