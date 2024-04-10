"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeColumnTrade1673230609603 = void 0;
class changeColumnTrade1673230609603 {
    async up(queryRunner) {
        await queryRunner.renameColumn('trades', 'instrumentSymbol', 'symbol');
    }
    async down() { }
}
exports.changeColumnTrade1673230609603 = changeColumnTrade1673230609603;
//# sourceMappingURL=1673230609603-change-column-trade.js.map