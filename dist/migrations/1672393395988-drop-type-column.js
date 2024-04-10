"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropTypeColumn1672393395988 = void 0;
class dropTypeColumn1672393395988 {
    async up(queryRunner) {
        await queryRunner.dropColumns('instruments', ['type']);
    }
    async down() { }
}
exports.dropTypeColumn1672393395988 = dropTypeColumn1672393395988;
//# sourceMappingURL=1672393395988-drop-type-column.js.map