"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserId1679888051383 = void 0;
const typeorm_1 = require("typeorm");
class addUserId1679888051383 {
    async up(queryRunner) {
        await queryRunner.addColumn('orders', new typeorm_1.TableColumn({
            name: 'userId',
            type: 'bigint',
            unsigned: true,
            default: 0,
        }));
        await queryRunner.addColumn('positions', new typeorm_1.TableColumn({
            name: 'userId',
            type: 'bigint',
            unsigned: true,
            default: 0,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('orders', 'userId');
        await queryRunner.dropColumn('positions', 'userId');
    }
}
exports.addUserId1679888051383 = addUserId1679888051383;
//# sourceMappingURL=1679888051383-add-userId.js.map