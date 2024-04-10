"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tally1638524590599 = void 0;
const typeorm_1 = require("typeorm");
class tally1638524590599 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tally',
            columns: [
                {
                    name: '_id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
            ],
        }));
        for (let i = 0; i < 100; i++) {
            await queryRunner.query('INSERT INTO tally VALUE()');
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('tally');
    }
}
exports.tally1638524590599 = tally1638524590599;
//# sourceMappingURL=1638524590599-tally.js.map