"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeColumn21679993894938 = void 0;
class removeColumn21679993894938 {
    async up(queryRunner) {
        await queryRunner.dropColumns('positions', ['realisedPnl', 'netFunding']);
        await queryRunner.dropColumns('margin_histories', ['realisedPnl', 'realisedPnlAfter']);
    }
    async down() { }
}
exports.removeColumn21679993894938 = removeColumn21679993894938;
//# sourceMappingURL=1679993894938-remove-column-2.js.map