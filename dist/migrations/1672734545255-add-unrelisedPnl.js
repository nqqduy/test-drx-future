"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUnrelisedPnl1672734545255 = void 0;
const typeorm_1 = require("typeorm");
class addUnrelisedPnl1672734545255 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'unrealisedPnl',
            type: 'decimal',
            precision: 22,
            scale: 8,
            default: 0,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('orders', ['unrealisedPnl']);
    }
}
exports.addUnrelisedPnl1672734545255 = addUnrelisedPnl1672734545255;
//# sourceMappingURL=1672734545255-add-unrelisedPnl.js.map