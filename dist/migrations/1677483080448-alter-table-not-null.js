"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alterTableNotNull1677483080448 = void 0;
const typeorm_1 = require("typeorm");
class alterTableNotNull1677483080448 {
    async up(queryRunner) {
        await queryRunner.changeColumn('accounts', 'usdtAvailableBalance', new typeorm_1.TableColumn({
            name: 'usdtAvailableBalance',
            type: 'decimal',
            precision: 30,
            scale: 15,
            default: 0,
            isNullable: true,
        }));
        await queryRunner.changeColumn('accounts', 'usdAvailableBalance', new typeorm_1.TableColumn({
            name: 'usdAvailableBalance',
            type: 'decimal',
            precision: 30,
            scale: 15,
            default: 0,
            isNullable: true,
        }));
        await queryRunner.changeColumn('positions', 'liquidationPrice', new typeorm_1.TableColumn({
            name: 'liquidationPrice',
            type: 'decimal',
            precision: 22,
            scale: 8,
            default: 0,
            isNullable: true,
        }));
    }
    async down() { }
}
exports.alterTableNotNull1677483080448 = alterTableNotNull1677483080448;
//# sourceMappingURL=1677483080448-alter-table-not-null.js.map