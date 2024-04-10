"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContractTypeInstruments1679563148968 = void 0;
const typeorm_1 = require("typeorm");
class addContractTypeInstruments1679563148968 {
    async up(queryRunner) {
        await queryRunner.addColumns('instruments', [
            new typeorm_1.TableColumn({
                name: 'contractType',
                type: 'varchar',
                default: "'USDM'",
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('instruments', 'contractType');
    }
}
exports.addContractTypeInstruments1679563148968 = addContractTypeInstruments1679563148968;
//# sourceMappingURL=1679563148968-add-contractType-instruments.js.map