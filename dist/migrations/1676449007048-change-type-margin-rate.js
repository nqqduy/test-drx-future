"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTypeMarginRate1676449007048 = void 0;
const typeorm_1 = require("typeorm");
class changeTypeMarginRate1676449007048 {
    async up(queryRunner) {
        await queryRunner.changeColumn('leverage_margin', 'maintenanceMarginRate', new typeorm_1.TableColumn({
            name: 'maintenanceMarginRate',
            type: 'DECIMAL(30,15)',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('leverage_margin', 'maintenanceMarginRate');
    }
}
exports.changeTypeMarginRate1676449007048 = changeTypeMarginRate1676449007048;
//# sourceMappingURL=1676449007048-change-type-margin-rate.js.map