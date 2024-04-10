"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLocationInUser1681789278001 = void 0;
const typeorm_1 = require("typeorm");
class addLocationInUser1681789278001 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'location',
            type: 'varchar',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('users', 'location');
    }
}
exports.addLocationInUser1681789278001 = addLocationInUser1681789278001;
//# sourceMappingURL=1681789278001-add-location-in-user.js.map