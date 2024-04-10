"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIsTriggeredColumn1677926588019 = void 0;
const typeorm_1 = require("typeorm");
class addIsTriggeredColumn1677926588019 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'isTriggered',
            type: 'boolean',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'isTriggered');
    }
}
exports.addIsTriggeredColumn1677926588019 = addIsTriggeredColumn1677926588019;
//# sourceMappingURL=1677926588019-add-is-triggered-column.js.map