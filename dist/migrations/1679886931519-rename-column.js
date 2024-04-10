"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameColumn1679886931519 = void 0;
const typeorm_1 = require("typeorm");
class renameColumn1679886931519 {
    async up(queryRunner) {
        await queryRunner.addColumns('trades', [
            new typeorm_1.TableColumn({
                name: 'buyUserId',
                type: 'bigint',
                unsigned: true,
            }),
            new typeorm_1.TableColumn({
                name: 'sellUserId',
                type: 'bigint',
                unsigned: true,
            }),
        ]);
    }
    async down() { }
}
exports.renameColumn1679886931519 = renameColumn1679886931519;
//# sourceMappingURL=1679886931519-rename-column.js.map