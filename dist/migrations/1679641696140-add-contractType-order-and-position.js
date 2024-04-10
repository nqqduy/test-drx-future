"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContractTypeOrderAndPosition1679641696140 = void 0;
const typeorm_1 = require("typeorm");
class addContractTypeOrderAndPosition1679641696140 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'contractType',
            type: 'varchar',
            default: "'USDM'",
            isNullable: true,
        }));
        await queryRunner.addColumn('positions', new typeorm_1.TableColumn({
            name: 'contractType',
            type: 'varchar',
            default: "'USDM'",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'contractType');
        await queryRunner.dropColumn('positions', 'contractType');
    }
}
exports.addContractTypeOrderAndPosition1679641696140 = addContractTypeOrderAndPosition1679641696140;
//# sourceMappingURL=1679641696140-add-contractType-order-and-position.js.map