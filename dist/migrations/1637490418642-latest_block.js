"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestBlock1637490418642 = void 0;
const typeorm_1 = require("typeorm");
class latestBlock1637490418642 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'latest_blocks',
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
                    name: 'blockNumber',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar(20)',
                    isNullable: true,
                },
                {
                    name: 'service',
                    type: 'varchar(50)',
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
        await queryRunner.createIndices('latest_blocks', [
            new typeorm_1.TableIndex({
                columnNames: ['service'],
                isUnique: true,
                name: 'IDX-latest_blocks-service',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['status'],
                isUnique: false,
                name: 'IDX-latest_blocks-status',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('latest_blocks');
    }
}
exports.latestBlock1637490418642 = latestBlock1637490418642;
//# sourceMappingURL=1637490418642-latest_block.js.map