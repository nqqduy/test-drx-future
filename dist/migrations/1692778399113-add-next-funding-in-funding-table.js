"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNextFundingInFundingTable1692778399113 = void 0;
const typeorm_1 = require("typeorm");
class addNextFundingInFundingTable1692778399113 {
    async up(queryRunner) {
        await queryRunner.addColumn('fundings', new typeorm_1.TableColumn({
            name: 'nextFunding',
            type: 'bigint',
            default: 0,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('fundings', 'nextFunding');
    }
}
exports.addNextFundingInFundingTable1692778399113 = addNextFundingInFundingTable1692778399113;
//# sourceMappingURL=1692778399113-add-next-funding-in-funding-table.js.map