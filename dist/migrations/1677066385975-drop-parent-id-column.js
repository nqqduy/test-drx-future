"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropParentIdColumn1677066385975 = void 0;
class dropParentIdColumn1677066385975 {
    async up(queryRunner) {
        await queryRunner.dropColumn('orders', 'parentOrderId');
    }
    async down() { }
}
exports.dropParentIdColumn1677066385975 = dropParentIdColumn1677066385975;
//# sourceMappingURL=1677066385975-drop-parent-id-column.js.map