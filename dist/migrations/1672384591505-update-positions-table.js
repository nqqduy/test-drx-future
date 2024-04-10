"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePositionsTable1672384591505 = void 0;
class updatePositionsTable1672384591505 {
    async up(queryRunner) {
        await queryRunner.dropColumn('positions', 'ownerEmail');
        await queryRunner.dropColumn('positions', 'managerEmail');
        await queryRunner.dropColumn('positions', 'latestRealisedPnl');
        await queryRunner.dropColumn('positions', 'multiplier');
        await queryRunner.dropColumn('positions', 'extraMargin');
    }
    async down() { }
}
exports.updatePositionsTable1672384591505 = updatePositionsTable1672384591505;
//# sourceMappingURL=1672384591505-update-positions-table.js.map