"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColumnTrade1675671740594 = void 0;
const typeorm_1 = require("typeorm");
class updateColumnTrade1675671740594 {
    async up(queryRunner) {
        await queryRunner.changeColumn('trades', 'buyFee', new typeorm_1.TableColumn({
            name: 'buyFee',
            type: 'decimal',
            precision: 22,
            scale: 8,
            default: 0,
            isNullable: true,
        }));
        await queryRunner.changeColumn('trades', 'sellFee', new typeorm_1.TableColumn({
            name: 'sellFee',
            type: 'decimal',
            precision: 22,
            scale: 8,
            default: 0,
            isNullable: true,
        }));
    }
    async down() { }
}
exports.updateColumnTrade1675671740594 = updateColumnTrade1675671740594;
//# sourceMappingURL=1675671740594-update-column-trade.js.map