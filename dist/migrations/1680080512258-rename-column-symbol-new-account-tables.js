"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameColumnSymbolNewAccountTables1680080512258 = void 0;
class renameColumnSymbolNewAccountTables1680080512258 {
    async up(queryRunner) {
        await queryRunner.renameColumn('new_accounts', 'symbol', 'asset');
    }
    async down(queryRunner) {
        await queryRunner.renameColumn('new_accounts', 'asset', 'symbol');
    }
}
exports.renameColumnSymbolNewAccountTables1680080512258 = renameColumnSymbolNewAccountTables1680080512258;
//# sourceMappingURL=1680080512258-rename-column-symbol-new-account-tables.js.map