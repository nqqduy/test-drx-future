"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
const funding_const_1 = require("../funding/funding.const");
const index_const_1 = require("../index/index.const");
const coin_info_constants_1 = require("../coin-info/coin-info.constants");
const candle_const_1 = require("../candle/candle.const");
const nestjs_redis_1 = require("nestjs-redis");
let MetricsService = class MetricsService {
    constructor(cacheManager, redisService) {
        this.cacheManager = cacheManager;
        this.redisService = redisService;
        this.registry = new prom_client_1.Registry();
        prom_client_1.collectDefaultMetrics({ register: this.registry });
    }
    async getMetrics() {
        return this.registry.metrics();
    }
    async healthcheckService() {
        const [healthcheckGetFunding, healthcheckPayFunding, healthcheckIndexPrice, healthcheckCoinInfo, healthcheckSyncCandle,] = await Promise.all([
            this.cacheManager.get(funding_const_1.KEY_CACHE_HEALTHCHECK_GET_FUNDING),
            this.cacheManager.get(funding_const_1.KEY_CACHE_HEALTHCHECK_PAY_FUNDING),
            this.cacheManager.get(index_const_1.KEY_CACHE_HEALTHCHECK_INDEX_PRICE),
            this.cacheManager.get(coin_info_constants_1.KEY_CACHE_HEALTHCHECK_COIN_INFO),
            this.cacheManager.get(candle_const_1.KEY_CACHE_HEALTHCHECK_SYNC_CANDLE),
        ]);
        return {
            healthcheck_get_funding: healthcheckGetFunding !== null && healthcheckGetFunding !== void 0 ? healthcheckGetFunding : false,
            healthcheck_pay_funding: healthcheckPayFunding !== null && healthcheckPayFunding !== void 0 ? healthcheckPayFunding : false,
            healthcheck_index_price: healthcheckIndexPrice !== null && healthcheckIndexPrice !== void 0 ? healthcheckIndexPrice : false,
            healthcheck_coin_info: healthcheckCoinInfo !== null && healthcheckCoinInfo !== void 0 ? healthcheckCoinInfo : false,
            healthcheck_sync_candle: healthcheckSyncCandle !== null && healthcheckSyncCandle !== void 0 ? healthcheckSyncCandle : false,
        };
    }
    async healcheckRedis() {
        const value = await this.redisService.getClient().keys('*');
        return value ? value.length : 0;
    }
};
MetricsService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, nestjs_redis_1.RedisService])
], MetricsService);
exports.MetricsService = MetricsService;
//# sourceMappingURL=metrics.service.js.map