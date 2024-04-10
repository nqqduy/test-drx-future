"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assets1677664010825 = void 0;
const typeorm_1 = require("typeorm");
class assets1677664010825 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'assets',
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
                    name: 'asset',
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
    }
    async down(queryRunner) {
        await queryRunner.dropTable('assets');
    }
}
exports.assets1677664010825 = assets1677664010825;
//# sourceMappingURL=1677664010825-assets.js.map