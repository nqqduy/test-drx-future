"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationColumnForTpslTrigger1673346720143 = void 0;
const typeorm_1 = require("typeorm");
class migrationColumnForTpslTrigger1673346720143 {
    async up(queryRunner) {
        await queryRunner.addColumns('user_settings', [
            new typeorm_1.TableColumn({
                name: 'time',
                type: 'datetime',
                default: 'CURRENT_TIMESTAMP',
            }),
        ]);
        await queryRunner.addColumns('user_settings', [
            new typeorm_1.TableColumn({
                name: 'notificationQuantity',
                type: 'int',
                default: 0,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('user_settings', 'notificationQuantity');
        await queryRunner.dropColumn('user_settings', 'time');
    }
}
exports.migrationColumnForTpslTrigger1673346720143 = migrationColumnForTpslTrigger1673346720143;
//# sourceMappingURL=1673346720143-migration-column-for-tpsl-trigger.js.map