"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrades1686192254248 = void 0;
const typeorm_1 = require("typeorm");
class addTrades1686192254248 {
    async up(queryRunner) {
        await queryRunner.addColumn('trades', new typeorm_1.TableColumn({
            name: 'buyEmail',
            type: 'varchar',
            default: null,
            isNullable: true,
        }));
        await queryRunner.addColumn('trades', new typeorm_1.TableColumn({
            name: 'sellEmail',
            type: 'varchar',
            default: null,
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('trades', ['sellEmail', 'buyEmail']);
    }
}
exports.addTrades1686192254248 = addTrades1686192254248;
//# sourceMappingURL=1686192254248-add-trades.js.map