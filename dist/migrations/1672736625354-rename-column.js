"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameColumn1672736625354 = void 0;
class renameColumn1672736625354 {
    async up(queryRunner) {
        await queryRunner.renameColumn('orders', 'tpSlType', 'tpSLType');
        await queryRunner.renameColumn('orders', 'tpSlPrice', 'tpSLPrice');
    }
    async down() { }
}
exports.renameColumn1672736625354 = renameColumn1672736625354;
//# sourceMappingURL=1672736625354-rename-column.js.map