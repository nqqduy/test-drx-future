"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGmail1686128632456 = void 0;
const typeorm_1 = require("typeorm");
class createGmail1686128632456 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'userEmail',
            type: 'varchar',
            default: null,
            isNullable: true,
        }));
        await queryRunner.addColumn('accounts', new typeorm_1.TableColumn({
            name: 'userEmail',
            type: 'varchar',
            default: null,
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'userEmail');
        await queryRunner.dropColumn('accounts', 'userEmail');
    }
}
exports.createGmail1686128632456 = createGmail1686128632456;
//# sourceMappingURL=1686128632456-create-gmail.js.map