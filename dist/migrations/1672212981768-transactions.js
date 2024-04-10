"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions1672212981768 = void 0;
const typeorm_1 = require("typeorm");
class transactions1672212981768 {
    async up(queryRunner) {
        await queryRunner.addColumns('transactions', [
            new typeorm_1.TableColumn({
                name: 'operationId',
                type: 'bigint',
                unsigned: true,
                default: 0,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('transactions', 'operationId');
    }
}
exports.transactions1672212981768 = transactions1672212981768;
//# sourceMappingURL=1672212981768-transactions.js.map