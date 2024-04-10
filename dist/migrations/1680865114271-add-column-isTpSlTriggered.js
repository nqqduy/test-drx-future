"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnIsTpSlTriggered1680865114271 = void 0;
const typeorm_1 = require("typeorm");
class addColumnIsTpSlTriggered1680865114271 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'isTpSlTriggered',
            type: 'boolean',
            default: 0,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'isTpSlTriggered');
    }
}
exports.addColumnIsTpSlTriggered1680865114271 = addColumnIsTpSlTriggered1680865114271;
//# sourceMappingURL=1680865114271-add-column-isTpSlTriggered.js.map