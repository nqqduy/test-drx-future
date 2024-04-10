"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingRulesRepository = void 0;
const tslib_1 = require("tslib");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
const trading_rules_entity_1 = require("../entities/trading_rules.entity");
let TradingRulesRepository = class TradingRulesRepository extends base_repository_1.BaseRepository {
};
TradingRulesRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(trading_rules_entity_1.TradingRulesEntity)
], TradingRulesRepository);
exports.TradingRulesRepository = TradingRulesRepository;
//# sourceMappingURL=trading-rules.repository.js.map