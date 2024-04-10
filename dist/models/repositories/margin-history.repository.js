"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginHistoryRepository = void 0;
const tslib_1 = require("tslib");
const margin_history_1 = require("../entities/margin-history");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let MarginHistoryRepository = class MarginHistoryRepository extends base_repository_1.BaseRepository {
};
MarginHistoryRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(margin_history_1.MarginHistoryEntity)
], MarginHistoryRepository);
exports.MarginHistoryRepository = MarginHistoryRepository;
//# sourceMappingURL=margin-history.repository.js.map