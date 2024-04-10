"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionHistoryRepository = void 0;
const tslib_1 = require("tslib");
const position_history_entity_1 = require("../entities/position-history.entity");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let PositionHistoryRepository = class PositionHistoryRepository extends base_repository_1.BaseRepository {
    async findHistoryBefore(date) {
        return this.createQueryBuilder()
            .where('createdAt < :date', { date })
            .orderBy('createdAt', 'DESC')
            .limit(1)
            .getOne();
    }
};
PositionHistoryRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(position_history_entity_1.PositionHistoryEntity)
], PositionHistoryRepository);
exports.PositionHistoryRepository = PositionHistoryRepository;
//# sourceMappingURL=position-history.repository.js.map