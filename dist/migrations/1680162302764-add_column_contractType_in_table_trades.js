"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnContractTypeInTableTrades1680162302764 = void 0;
const typeorm_1 = require("typeorm");
class addColumnContractTypeInTableTrades1680162302764 {
    constructor() {
        this.name = 'addColumnContractTypeInTableTrades1680162302764';
    }
    async up(queryRunner) {
        await queryRunner.addColumn('trades', new typeorm_1.TableColumn({
            name: 'contractType',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('trades', 'contractType');
    }
}
exports.addColumnContractTypeInTableTrades1680162302764 = addColumnContractTypeInTableTrades1680162302764;
//# sourceMappingURL=1680162302764-add_column_contractType_in_table_trades.js.map