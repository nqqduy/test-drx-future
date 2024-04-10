"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHistories1625208077403 = void 0;
const typeorm_1 = require("typeorm");
class loginHistories1625208077403 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'login_histories',
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
                    name: 'ip',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'device',
                    type: 'varchar',
                    isNullable: true,
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
        await queryRunner.createIndices('login_histories', [
            new typeorm_1.TableIndex({
                columnNames: ['userId'],
                isUnique: false,
                name: 'IDX-login_histories-userId',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['ip'],
                isUnique: false,
                name: 'IDX-login_histories-ip',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['createdAt'],
                isUnique: false,
                name: 'IDX-login_histories-createdAt',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['updatedAt'],
                isUnique: false,
                name: 'IDX-login_histories-udpatedAt',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('login_histories'))
            await queryRunner.dropTable('login_histories');
    }
}
exports.loginHistories1625208077403 = loginHistories1625208077403;
//# sourceMappingURL=1625208077403-login_histories.js.map