"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStopStopConditionFieldToOderTable1676951556211 = void 0;
const typeorm_1 = require("typeorm");
class addStopStopConditionFieldToOderTable1676951556211 {
    async up(queryRunner) {
        await queryRunner.addColumns('orders', [
            new typeorm_1.TableColumn({
                name: 'stopCondition',
                type: 'varchar(10)',
                isNullable: true,
                default: null,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('orders', ['stopCondition']);
    }
}
exports.addStopStopConditionFieldToOderTable1676951556211 = addStopStopConditionFieldToOderTable1676951556211;
//# sourceMappingURL=1676951556211-add-stop-stopCondition-field-to-oder-table.js.map