"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSettings1630486781471 = void 0;
const typeorm_1 = require("typeorm");
class userSettings1630486781471 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user_settings',
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
                    name: 'key',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'value',
                    type: 'varchar',
                    isNullable: false,
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
        await queryRunner.createIndices('user_settings', [
            new typeorm_1.TableIndex({
                columnNames: ['userId'],
                isUnique: false,
                name: 'IDX-user_settings-userId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['key'],
                isUnique: false,
                name: 'IDX-user_settings-key',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['value'],
                isUnique: false,
                name: 'IDX-user_settings-value',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['userId', 'key', 'value'],
                isUnique: true,
                name: 'IDX-user_settings-userId_key_value',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('user_settings'))
            await queryRunner.dropTable('user_settings');
    }
}
exports.userSettings1630486781471 = userSettings1630486781471;
//# sourceMappingURL=1630486781471-user_settings.js.map