"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColumLeverageMargin1676887159731 = void 0;
const typeorm_1 = require("typeorm");
class updateColumLeverageMargin1676887159731 {
    async up(queryRunner) {
        await queryRunner.addColumn('leverage_margin', new typeorm_1.TableColumn({
            name: 'symbol',
            type: 'varchar',
            isNullable: false,
        }));
        await queryRunner.dropColumn('leverage_margin', 'instrumentId');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('leverage_margin', 'symbol');
    }
}
exports.updateColumLeverageMargin1676887159731 = updateColumLeverageMargin1676887159731;
//# sourceMappingURL=1676887159731-update-colum-leverage-margin.js.map