"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRepository = void 0;
const typeorm_1 = require("typeorm");
class AppRepository extends typeorm_1.Repository {
    insertIgnore(entity) {
        return this.createQueryBuilder()
            .insert()
            .into(this.metadata.target)
            .values(entity)
            .orIgnore()
            .execute();
    }
    insertOnDuplicate(entity, overwrite, conflictTarget) {
        return this.createQueryBuilder()
            .insert()
            .into(this.metadata.target)
            .values(entity)
            .orUpdate(overwrite, conflictTarget)
            .execute();
    }
    replaceMulti(entity) {
        const [query, queryParams] = this.createQueryBuilder()
            .insert()
            .into(this.metadata.target)
            .values(entity)
            .getQueryAndParameters();
        const newQuery = query.replace('INSERT INTO', 'REPLACE INTO');
        return this.manager.query(newQuery, queryParams);
    }
}
exports.AppRepository = AppRepository;
//# sourceMappingURL=app.repository.js.map