"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContractTypeForLeverageMargin1681286807083 = void 0;
const typeorm_1 = require("typeorm");
class addContractTypeForLeverageMargin1681286807083 {
    async up(queryRunner) {
        await queryRunner.addColumn('leverage_margin', new typeorm_1.TableColumn({
            name: 'contractType',
            type: 'varchar(7)',
            default: null,
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('leverage_margin', 'contractType');
    }
}
exports.addContractTypeForLeverageMargin1681286807083 = addContractTypeForLeverageMargin1681286807083;
//# sourceMappingURL=1681286807083-add-contract-type-for-leverage-margin.js.map