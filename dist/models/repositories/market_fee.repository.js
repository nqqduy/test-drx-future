"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketFeeRepository = void 0;
const tslib_1 = require("tslib");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
const market_fee_entity_1 = require("../entities/market_fee.entity");
let MarketFeeRepository = class MarketFeeRepository extends base_repository_1.BaseRepository {
};
MarketFeeRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(market_fee_entity_1.MarketFeeEntity)
], MarketFeeRepository);
exports.MarketFeeRepository = MarketFeeRepository;
//# sourceMappingURL=market_fee.repository.js.map