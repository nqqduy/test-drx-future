"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestSignature1637490418642 = void 0;
const typeorm_1 = require("typeorm");
class latestSignature1637490418642 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'latest_signatures',
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
                    name: 'signature',
                    type: 'char',
                    precision: 90,
                },
                {
                    name: 'service',
                    type: 'varchar(50)',
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
        await queryRunner.createIndices('latest_signatures', [
            new typeorm_1.TableIndex({
                columnNames: ['service'],
                isUnique: true,
                name: 'IDX-latest_signatures-service',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('latest_signatures');
    }
}
exports.latestSignature1637490418642 = latestSignature1637490418642;
//# sourceMappingURL=1637490418642-latest_signatures.js.map