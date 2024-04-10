"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const market_data_entity_1 = require("../entities/market-data.entity");
let MarketDataRepository = class MarketDataRepository extends typeorm_1.Repository {
};
MarketDataRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(market_data_entity_1.MarketDataEntity)
], MarketDataRepository);
exports.MarketDataRepository = MarketDataRepository;
//# sourceMappingURL=market-data.repository.js.map