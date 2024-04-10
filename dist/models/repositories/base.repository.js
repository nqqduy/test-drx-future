"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const typeorm_1 = require("typeorm");
class BaseRepository extends typeorm_1.Repository {
    async insertOrUpdate(entities) {
        if (entities.length == 0) {
            return;
        }
        const columns = this.getColumns(entities[0].constructor.name);
        const quotedColumns = columns.map((column) => `\`${column}\``);
        const tableName = this.getTableName(entities[0].constructor.name);
        const columnsString = quotedColumns.join(', ');
        const placeholder = new Array(columns.length).fill('?');
        const placeholders = new Array(entities.length).fill(`(${placeholder})`).join(', ');
        const valueString = [];
        for (const column of quotedColumns) {
            if (column !== '`operationId`' && (tableName === 'positions' || tableName === 'orders')) {
                valueString.push(`${column} = IF(VALUES(operationId) >= operationId, VALUES(${column}), ${column})`);
            }
            else if (column !== '`operationId`') {
                valueString.push(`${column} = IF(VALUES(operationId) > operationId, VALUES(${column}), ${column})`);
            }
        }
        valueString.push('`operationId` = IF(VALUES(operationId) > operationId, VALUES(`operationId`), `operationId`);');
        let sql = '';
        sql += `INSERT INTO \`${tableName}\` (${columnsString})`;
        sql += ` VALUES ${placeholders}`;
        sql += ` ON DUPLICATE KEY UPDATE ${valueString}`;
        const params = [];
        for (const entity of entities) {
            for (const column of columns) {
                params.push(entity[column]);
            }
        }
        await this.manager.query(sql, params);
    }
    async findBatch(fromId, count) {
        return this.createQueryBuilder().where('id > :fromId', { fromId }).orderBy('id', 'ASC').take(count).getMany();
    }
    async getLastId() {
        const order = {};
        order['id'] = 'DESC';
        const entity = await this.findOne({ order });
        if (entity) {
            return entity.id;
        }
        else {
            return 0;
        }
    }
    getColumns(target) {
        const queryBuilder = this.createQueryBuilder();
        return queryBuilder.connection.getMetadata(target).columns.map((column) => column.propertyName);
    }
    getTableName(target) {
        const queryBuilder = this.createQueryBuilder();
        return queryBuilder.connection.getMetadata(target).tableName;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map