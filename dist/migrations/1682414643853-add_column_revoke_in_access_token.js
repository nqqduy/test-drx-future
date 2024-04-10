"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnRevokeInAccessToken1682414643853 = void 0;
const typeorm_1 = require("typeorm");
class addColumnRevokeInAccessToken1682414643853 {
    constructor() {
        this.name = 'addColumnRevokeInAccessToken1682414643853';
    }
    async up(queryRunner) {
        await queryRunner.addColumn('access-tokens', new typeorm_1.TableColumn({
            name: 'revoked',
            type: 'boolean',
            default: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('access-tokens', 'revoked');
    }
}
exports.addColumnRevokeInAccessToken1682414643853 = addColumnRevokeInAccessToken1682414643853;
//# sourceMappingURL=1682414643853-add_column_revoke_in_access_token.js.map