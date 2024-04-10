"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings1639209748967 = void 0;
const typeorm_1 = require("typeorm");
class settings1639209748967 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'settings',
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
        }));
        await queryRunner.createIndex('settings', new typeorm_1.TableIndex({
            columnNames: ['key'],
            isUnique: true,
            name: 'IDX-settings-key',
        }));
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('settings'))
            await queryRunner.dropTable('settings');
    }
}
exports.settings1639209748967 = settings1639209748967;
//# sourceMappingURL=1639209748967-settings.js.map