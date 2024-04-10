"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserIdForFundingHistoryTables1680690937913 = void 0;
const typeorm_1 = require("typeorm");
class addUserIdForFundingHistoryTables1680690937913 {
    async up(queryRunner) {
        await queryRunner.addColumn('funding_histories', new typeorm_1.TableColumn({
            name: 'userId',
            type: 'bigint',
            default: 0,
        }));
        await queryRunner.addColumn('funding_histories', new typeorm_1.TableColumn({
            name: 'contractType',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('funding_histories', 'userId');
        await queryRunner.dropColumn('funding_histories', 'contractType');
    }
}
exports.addUserIdForFundingHistoryTables1680690937913 = addUserIdForFundingHistoryTables1680690937913;
//# sourceMappingURL=1680690937913-add-user-id-for-funding-history-tables.js.map