"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropFeeColumnTransaction1672298873194 = void 0;
class dropFeeColumnTransaction1672298873194 {
    async up(queryRunner) {
        await queryRunner.dropColumns('transactions', ['fee']);
    }
    async down() { }
}
exports.dropFeeColumnTransaction1672298873194 = dropFeeColumnTransaction1672298873194;
//# sourceMappingURL=1672298873194-drop-fee-column-transaction.js.map