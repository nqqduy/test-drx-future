"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCoinImageInCoinInfoTable1679047573299 = void 0;
const typeorm_1 = require("typeorm");
class addCoinImageInCoinInfoTable1679047573299 {
    async up(queryRunner) {
        await queryRunner.addColumn('coin_info', new typeorm_1.TableColumn({
            name: 'coin_image',
            type: 'TEXT',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('coin_info', 'coin_image');
    }
}
exports.addCoinImageInCoinInfoTable1679047573299 = addCoinImageInCoinInfoTable1679047573299;
//# sourceMappingURL=1679047573299-add-coin-image-in-coin-info-table.js.map