"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataTypeOrderForTypeColumn1673339080519 = void 0;
class updateDataTypeOrderForTypeColumn1673339080519 {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE orders Modify column type varchar(10)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE orders Modify column type varchar(6)');
    }
}
exports.updateDataTypeOrderForTypeColumn1673339080519 = updateDataTypeOrderForTypeColumn1673339080519;
//# sourceMappingURL=1673339080519-update-data-type-order-for-type-column.js.map