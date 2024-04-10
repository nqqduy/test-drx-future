"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessToken1670294390095 = void 0;
const typeorm_1 = require("typeorm");
class accessToken1670294390095 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'access-tokens',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
                {
                    name: 'token',
                    type: 'text',
                },
                {
                    name: 'user_id',
                    type: 'int',
                    unsigned: true,
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
        if (await queryRunner.hasTable('access-tokens')) {
            await queryRunner.dropTable('access-tokens');
        }
    }
}
exports.accessToken1670294390095 = accessToken1670294390095;
//# sourceMappingURL=1670294390095-access-token.js.map