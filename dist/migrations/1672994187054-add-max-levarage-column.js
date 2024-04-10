"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMaxLevarageColumn1672994187054 = void 0;
const typeorm_1 = require("typeorm");
class addMaxLevarageColumn1672994187054 {
    async up(queryRunner) {
        await queryRunner.addColumns('trading_rules', [
            new typeorm_1.TableColumn({
                name: 'maxLeverage',
                type: 'int',
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('trading_rules', 'maxLeverage');
    }
}
exports.addMaxLevarageColumn1672994187054 = addMaxLevarageColumn1672994187054;
//# sourceMappingURL=1672994187054-add-max-levarage-column.js.map