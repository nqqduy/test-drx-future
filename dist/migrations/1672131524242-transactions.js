"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions1672131524242 = void 0;
class transactions1672131524242 {
    async up(queryRunner) {
        await queryRunner.renameColumn('transactions', 'userId', 'accountId');
    }
    async down() { }
}
exports.transactions1672131524242 = transactions1672131524242;
//# sourceMappingURL=1672131524242-transactions.js.map