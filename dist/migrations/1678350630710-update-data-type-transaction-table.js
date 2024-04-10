"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataTypeTransactionTable1678350630710 = void 0;
class updateDataTypeTransactionTable1678350630710 {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE transactions Modify column type varchar(30)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE transactions Modify column type varchar(20)');
    }
}
exports.updateDataTypeTransactionTable1678350630710 = updateDataTypeTransactionTable1678350630710;
//# sourceMappingURL=1678350630710-update-data-type-transaction-table.js.map