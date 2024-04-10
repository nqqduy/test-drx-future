"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.account1672214063925 = void 0;
const typeorm_1 = require("typeorm");
class account1672214063925 {
    async up(queryRunner) {
        await queryRunner.addColumns('accounts', [
            new typeorm_1.TableColumn({
                name: 'operationId',
                type: 'bigint',
                unsigned: true,
                default: 0,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('accounts', 'operationId');
    }
}
exports.account1672214063925 = account1672214063925;
//# sourceMappingURL=1672214063925-account.js.map