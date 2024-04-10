"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUniqueForPositionsTables1679452854150 = void 0;
class updateUniqueForPositionsTables1679452854150 {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE positions ADD CONSTRAINT  UC_POSITIONS_ACCOUNT_SYMBOL UNIQUE (accountId,symbol)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE positions DROP INDEX CONSTRAINT UC_POSITIONS_ACCOUNT_SYMBOL');
    }
}
exports.updateUniqueForPositionsTables1679452854150 = updateUniqueForPositionsTables1679452854150;
//# sourceMappingURL=1679452854150-update-unique-for-positions-tables.js.map