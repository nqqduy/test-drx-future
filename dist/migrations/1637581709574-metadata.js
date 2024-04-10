"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata1637581709574 = void 0;
const typeorm_1 = require("typeorm");
class metadata1637581709574 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'metadata',
            columns: [
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                    isPrimary: true,
                },
                {
                    name: 'data',
                    type: 'text',
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
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('metadata')) {
            await queryRunner.dropTable('metadata');
        }
    }
}
exports.metadata1637581709574 = metadata1637581709574;
//# sourceMappingURL=1637581709574-metadata.js.map