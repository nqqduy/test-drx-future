"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingHistoryRepository = void 0;
const tslib_1 = require("tslib");
const funding_history_entity_1 = require("../entities/funding-history.entity");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let FundingHistoryRepository = class FundingHistoryRepository extends base_repository_1.BaseRepository {
    async findHistoryBefore(date) {
        return this.createQueryBuilder().where('time < :date', { date }).orderBy('time', 'DESC').limit(1).getOne();
    }
};
FundingHistoryRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(funding_history_entity_1.FundingHistoryEntity)
], FundingHistoryRepository);
exports.FundingHistoryRepository = FundingHistoryRepository;
//# sourceMappingURL=funding-history.repository.js.map