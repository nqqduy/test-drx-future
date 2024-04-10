"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCloseSizeAvgClosePriceInPosition1691481447172 = void 0;
const typeorm_1 = require("typeorm");
class addCloseSizeAvgClosePriceInPosition1691481447172 {
    async up(queryRunner) {
        await queryRunner.addColumns('positions', [
            new typeorm_1.TableColumn({
                name: 'closeSize',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'avgClosePrice',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('positions', ['closeSize', 'avgClosePrice']);
    }
}
exports.addCloseSizeAvgClosePriceInPosition1691481447172 = addCloseSizeAvgClosePriceInPosition1691481447172;
//# sourceMappingURL=1691481447172-add-closeSize-avgClosePrice-in-position.js.map