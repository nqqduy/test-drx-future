"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const nestjs_redis_1 = require("nestjs-redis");
const redis_config_1 = require("../../configs/redis.config");
const funding_module_1 = require("../funding/funding.module");
const index_service_1 = require("./index.service");
const instrument_module_1 = require("../instrument/instrument.module");
const orderbook_module_1 = require("../orderbook/orderbook.module");
const index_controller_1 = require("./index.controller");
let IndexModule = class IndexModule {
};
IndexModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            nestjs_redis_1.RedisModule.register(Object.assign({}, redis_config_1.redisConfig)),
            instrument_module_1.InstrumentModule,
            funding_module_1.FundingModule,
            orderbook_module_1.OrderbookModule,
        ],
        providers: [index_service_1.IndexService],
        exports: [index_service_1.IndexService],
        controllers: [index_controller_1.IndexController],
    })
], IndexModule);
exports.IndexModule = IndexModule;
//# sourceMappingURL=index.module.js.map