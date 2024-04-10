"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDefaultValue1680252482175 = void 0;
const typeorm_1 = require("typeorm");
class changeDefaultValue1680252482175 {
    async up(queryRunner) {
        await Promise.all([
            queryRunner.changeColumn('instruments', 'contractType', new typeorm_1.TableColumn({
                name: 'contractType',
                type: 'varchar',
                default: "'USD_M'",
                isNullable: true,
            })),
            queryRunner.changeColumn('orders', 'contractType', new typeorm_1.TableColumn({
                name: 'contractType',
                type: 'varchar',
                default: "'USD_M'",
                isNullable: true,
            })),
            queryRunner.changeColumn('positions', 'contractType', new typeorm_1.TableColumn({
                name: 'contractType',
                type: 'varchar',
                default: "'USD_M'",
                isNullable: true,
            })),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('instruments', 'contractType');
    }
}
exports.changeDefaultValue1680252482175 = changeDefaultValue1680252482175;
//# sourceMappingURL=1680252482175-change-default-value.js.map