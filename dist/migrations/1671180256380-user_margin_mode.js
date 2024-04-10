"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMarginMode1671180256380 = void 0;
const order_enum_1 = require("../shares/enums/order.enum");
const typeorm_1 = require("typeorm");
class userMarginMode1671180256380 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user_margin_mode',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
                {
                    name: 'userId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'instrumentId',
                    type: 'bigint',
                    isNullable: false,
                },
                {
                    name: 'contract',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'marginMode',
                    type: 'varchar(20)',
                    isNullable: true,
                    comment: Object.keys(order_enum_1.MarginMode).join(','),
                },
                {
                    name: 'leverage',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndices('user_margin_mode', [
            new typeorm_1.TableIndex({
                columnNames: ['userId'],
                isUnique: false,
                name: 'IDX-user_margin_mode-userId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['instrumentId'],
                isUnique: false,
                name: 'IDX-user_margin_mode-instrumentId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['contract'],
                isUnique: false,
                name: 'IDX-user_margin_mode-contract',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['marginMode'],
                isUnique: false,
                name: 'IDX-user_margin_mode-marginMode',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['leverage'],
                isUnique: false,
                name: 'IDX-user_margin_mode-leverage',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('user_margin_mode')) {
            await queryRunner.dropTable('user_margin_mode');
        }
    }
}
exports.userMarginMode1671180256380 = userMarginMode1671180256380;
//# sourceMappingURL=1671180256380-user_margin_mode.js.map