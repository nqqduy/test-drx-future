"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketIndexRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const market_index_entity_1 = require("../entities/market-index.entity");
let MarketIndexRepository = class MarketIndexRepository extends typeorm_1.Repository {
};
MarketIndexRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(market_index_entity_1.MarketIndexEntity)
], MarketIndexRepository);
exports.MarketIndexRepository = MarketIndexRepository;
//# sourceMappingURL=market-indices.repository.js.map