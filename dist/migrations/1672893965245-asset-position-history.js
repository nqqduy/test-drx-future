"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetPositionHistory1672893965245 = void 0;
const typeorm_1 = require("typeorm");
class assetPositionHistory1672893965245 {
    async up(queryRunner) {
        await queryRunner.addColumns('position_histories', [
            new typeorm_1.TableColumn({
                name: 'asset',
                type: 'varchar',
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('position_histories', ['asset']);
    }
}
exports.assetPositionHistory1672893965245 = assetPositionHistory1672893965245;
//# sourceMappingURL=1672893965245-asset-position-history.js.map