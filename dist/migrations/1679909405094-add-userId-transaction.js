"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserIdTransaction1679909405094 = void 0;
const typeorm_1 = require("typeorm");
class addUserIdTransaction1679909405094 {
    async up(queryRunner) {
        await queryRunner.addColumn('transactions', new typeorm_1.TableColumn({
            name: 'userId',
            type: 'bigint',
            unsigned: true,
            default: 0,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('transactions', 'userId');
    }
}
exports.addUserIdTransaction1679909405094 = addUserIdTransaction1679909405094;
//# sourceMappingURL=1679909405094-add-userId-transaction.js.map