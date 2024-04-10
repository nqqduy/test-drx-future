"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNotificationTokenToUserTables1682415160999 = void 0;
const typeorm_1 = require("typeorm");
class addNotificationTokenToUserTables1682415160999 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'notification_token',
            type: 'TEXT',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('users', 'notification_token');
    }
}
exports.addNotificationTokenToUserTables1682415160999 = addNotificationTokenToUserTables1682415160999;
//# sourceMappingURL=1682415160999-add-notification-token-to-user-tables.js.map