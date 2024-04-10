"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAssetTransactions1672309100248 = void 0;
const typeorm_1 = require("typeorm");
class addAssetTransactions1672309100248 {
    async up(queryRunner) {
        await queryRunner.addColumns('transactions', [
            new typeorm_1.TableColumn({
                name: 'asset',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('transactions', 'asset');
    }
}
exports.addAssetTransactions1672309100248 = addAssetTransactions1672309100248;
//# sourceMappingURL=1672309100248-add-asset-transactions.js.map