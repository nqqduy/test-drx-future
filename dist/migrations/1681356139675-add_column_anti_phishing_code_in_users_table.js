"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnAntiPhishingCodeInUsersTable1681356139675 = void 0;
const typeorm_1 = require("typeorm");
class addColumnAntiPhishingCodeInUsersTable1681356139675 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'antiPhishingCode',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('users', 'antiPhishingCode');
    }
}
exports.addColumnAntiPhishingCodeInUsersTable1681356139675 = addColumnAntiPhishingCodeInUsersTable1681356139675;
//# sourceMappingURL=1681356139675-add_column_anti_phishing_code_in_users_table.js.map