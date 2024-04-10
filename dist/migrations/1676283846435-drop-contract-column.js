"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropContractColumn1676283846435 = void 0;
class dropContractColumn1676283846435 {
    async up(queryRunner) {
        await queryRunner.dropColumn('user_margin_mode', 'contract');
    }
    async down() { }
}
exports.dropContractColumn1676283846435 = dropContractColumn1676283846435;
//# sourceMappingURL=1676283846435-drop-contract-column.js.map