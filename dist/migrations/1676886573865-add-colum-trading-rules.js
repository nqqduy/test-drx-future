"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumTradingRules1676886573865 = void 0;
const typeorm_1 = require("typeorm");
class addColumTradingRules1676886573865 {
    async up(queryRunner) {
        await queryRunner.addColumns('trading_rules', [
            new typeorm_1.TableColumn({
                name: 'maxNotinal',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
            new typeorm_1.TableColumn({
                name: 'symbol',
                type: 'varchar',
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: 'maxOrderPrice',
                type: 'decimal',
                precision: 22,
                scale: 8,
                default: 0,
            }),
        ]);
        await queryRunner.dropColumn('trading_rules', 'instrumentId');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('trading_rules', 'maxNotinal');
        await queryRunner.dropColumn('trading_rules', 'symbol');
        await queryRunner.dropColumn('trading_rules', 'maxOrderPrice');
    }
}
exports.addColumTradingRules1676886573865 = addColumTradingRules1676886573865;
//# sourceMappingURL=1676886573865-add-colum-trading-rules.js.map