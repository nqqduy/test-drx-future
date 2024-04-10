"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnContractTypeTransaction1680252169840 = void 0;
const typeorm_1 = require("typeorm");
class addColumnContractTypeTransaction1680252169840 {
    async up(queryRunner) {
        await queryRunner.addColumn('transactions', new typeorm_1.TableColumn({
            name: 'contractType',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('transactions', 'contractType');
    }
}
exports.addColumnContractTypeTransaction1680252169840 = addColumnContractTypeTransaction1680252169840;
//# sourceMappingURL=1680252169840-add-column-contract-type-transaction.js.map