"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfo1670812575067 = void 0;
const typeorm_1 = require("typeorm");
class CoinInfo1670812575067 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'coin_info',
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
                    name: 'fullName',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'baseId',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'symbol',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'rank',
                    type: 'int',
                    unsigned: true,
                    isNullable: true,
                },
                {
                    name: 'marketCap',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'cirSupply',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'maxSupply',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'totalSupply',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'issueDate',
                    type: 'datetime',
                    isNullable: true,
                },
                {
                    name: 'issuePrice',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'explorer',
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
        }));
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('coin_info')) {
            await queryRunner.dropTable('coin_info');
        }
    }
}
exports.CoinInfo1670812575067 = CoinInfo1670812575067;
//# sourceMappingURL=1670812575067-CoinInfo.js.map