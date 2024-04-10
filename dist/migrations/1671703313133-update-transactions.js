"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactions1671703313133 = void 0;
const typeorm_1 = require("typeorm");
class updateTransactions1671703313133 {
    async up(queryRunner) {
        await queryRunner.addColumns('transactions', [
            new typeorm_1.TableColumn({
                name: 'symbol',
                type: 'varchar',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'asset',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
        await queryRunner.dropColumn('transactions', 'accountId');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('transactions', 'symbol');
        await queryRunner.dropColumn('transactions', 'asset');
    }
}
exports.updateTransactions1671703313133 = updateTransactions1671703313133;
//# sourceMappingURL=1671703313133-update-transactions.js.map