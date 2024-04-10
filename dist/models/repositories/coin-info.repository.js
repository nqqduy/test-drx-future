"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfoRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const coin_info_entity_1 = require("../entities/coin-info.entity");
let CoinInfoRepository = class CoinInfoRepository extends typeorm_1.Repository {
};
CoinInfoRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(coin_info_entity_1.CoinInfoEntity)
], CoinInfoRepository);
exports.CoinInfoRepository = CoinInfoRepository;
//# sourceMappingURL=coin-info.repository.js.map