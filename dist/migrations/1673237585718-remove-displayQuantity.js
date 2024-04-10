"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDisplayQuantity1673237585718 = void 0;
class removeDisplayQuantity1673237585718 {
    async up(queryRunner) {
        await queryRunner.dropColumns('orders', ['displayQuantity']);
    }
    async down() { }
}
exports.removeDisplayQuantity1673237585718 = removeDisplayQuantity1673237585718;
//# sourceMappingURL=1673237585718-remove-displayQuantity.js.map