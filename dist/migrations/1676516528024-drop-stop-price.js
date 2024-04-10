"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropStopPrice1676516528024 = void 0;
class dropStopPrice1676516528024 {
    async up(queryRunner) {
        await queryRunner.dropColumn('orders', 'stopPrice');
    }
    async down() { }
}
exports.dropStopPrice1676516528024 = dropStopPrice1676516528024;
//# sourceMappingURL=1676516528024-drop-stop-price.js.map