"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccountTable1679470691328 = void 0;
const typeorm_1 = require("typeorm");
class createNewAccountTable1679470691328 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'new_accounts',
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
                    name: 'symbol',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'balance',
                    type: 'decimal',
                    precision: 30,
                    scale: 15,
                    default: 0,
                },
                {
                    name: 'operationId',
                    type: 'bigint',
                    isNullable: false,
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
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('new_accounts'))
            await queryRunner.dropTable('new_accounts');
    }
}
exports.createNewAccountTable1679470691328 = createNewAccountTable1679470691328;
//# sourceMappingURL=1679470691328-create-new-account-table.js.map