"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAdjustMarginColumn1677573991108 = void 0;
const typeorm_1 = require("typeorm");
class addAdjustMarginColumn1677573991108 {
    async up(queryRunner) {
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'adjustMargin',
                type: 'decimal',
                precision: 22,
                scale: 8,
                isNullable: true,
                default: null,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'adjustMargin');
    }
}
exports.addAdjustMarginColumn1677573991108 = addAdjustMarginColumn1677573991108;
//# sourceMappingURL=1677573991108-add-adjust-margin-column.js.map