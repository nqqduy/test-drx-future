"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAssetToFundingHistory1677063866984 = void 0;
const typeorm_1 = require("typeorm");
class addAssetToFundingHistory1677063866984 {
    async up(queryRunner) {
        await queryRunner.addColumns('funding_histories', [
            new typeorm_1.TableColumn({
                name: 'asset',
                type: 'varchar(10)',
                isNullable: true,
                default: null,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('funding_histories', 'asset');
    }
}
exports.addAssetToFundingHistory1677063866984 = addAssetToFundingHistory1677063866984;
//# sourceMappingURL=1677063866984-add-asset-to-funding-history.js.map