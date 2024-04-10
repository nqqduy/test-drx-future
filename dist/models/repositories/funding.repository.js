"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingRepository = void 0;
const tslib_1 = require("tslib");
const funding_entity_1 = require("../entities/funding.entity");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let FundingRepository = class FundingRepository extends base_repository_1.BaseRepository {
};
FundingRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(funding_entity_1.FundingEntity)
], FundingRepository);
exports.FundingRepository = FundingRepository;
//# sourceMappingURL=funding.repository.js.map