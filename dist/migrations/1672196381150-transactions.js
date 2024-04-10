"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions1672196381150 = void 0;
class transactions1672196381150 {
    async up(queryRunner) {
        await queryRunner.dropColumns('transactions', ['logIndex', 'operationId', 'asset', 'txHash']);
    }
    async down() { }
}
exports.transactions1672196381150 = transactions1672196381150;
//# sourceMappingURL=1672196381150-transactions.js.map