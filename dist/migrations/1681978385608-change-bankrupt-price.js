"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeBankruptPrice1681978385608 = void 0;
const typeorm_1 = require("typeorm");
class changeBankruptPrice1681978385608 {
    async up(queryRunner) {
        await queryRunner.changeColumn('positions', 'bankruptPrice', new typeorm_1.TableColumn({
            name: 'bankruptPrice',
            type: 'decimal',
            precision: 22,
            scale: 8,
            isNullable: true,
        }));
    }
    async down() { }
}
exports.changeBankruptPrice1681978385608 = changeBankruptPrice1681978385608;
//# sourceMappingURL=1681978385608-change-bankrupt-price.js.map