"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIndex1688958880930 = void 0;
const typeorm_1 = require("typeorm");
class updateIndex1688958880930 {
    async up(queryRunner) {
        const tableIndices = await queryRunner.getTable('trades');
        for (const index of tableIndices.indices) {
            if ((index.columnNames = ['id'])) {
                console.log(index, 'iddd');
                continue;
            }
            await queryRunner.dropIndex('trades', new typeorm_1.TableIndex({
                columnNames: index.columnNames,
                name: index.name,
            }));
        }
        await Promise.all([
            queryRunner.createIndex('trades', new typeorm_1.TableIndex({
                columnNames: ['sellUserId', 'symbol'],
            })),
            queryRunner.createIndex('trades', new typeorm_1.TableIndex({
                columnNames: ['buyUserId', 'symbol'],
            })),
            queryRunner.createIndex('trades', new typeorm_1.TableIndex({
                columnNames: ['createdAt'],
            })),
            queryRunner.createIndex('trades', new typeorm_1.TableIndex({
                columnNames: ['updatedAt'],
            })),
        ]);
    }
    async down() { }
}
exports.updateIndex1688958880930 = updateIndex1688958880930;
//# sourceMappingURL=1688958880930-update-index.js.map