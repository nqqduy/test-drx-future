"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFundingIntervalInFundingHistory1677206143246 = void 0;
const typeorm_1 = require("typeorm");
class addFundingIntervalInFundingHistory1677206143246 {
    async up(queryRunner) {
        await queryRunner.addColumn('funding_histories', new typeorm_1.TableColumn({
            name: 'fundingInterval',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('funding_histories', 'fundingInterval');
    }
}
exports.addFundingIntervalInFundingHistory1677206143246 = addFundingIntervalInFundingHistory1677206143246;
//# sourceMappingURL=1677206143246-add-fundingInterval-in-fundingHistory.js.map