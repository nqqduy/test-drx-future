"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const database_common_1 = require("../../models/database-common");
const funding_module_1 = require("../funding/funding.module");
const index_module_1 = require("../index/index.module");
const instrument_module_1 = require("../instrument/instrument.module");
const ticker_console_1 = require("./ticker.console");
const ticker_controller_1 = require("./ticker.controller");
const ticker_service_1 = require("./ticker.service");
const trade_module_1 = require("../trade/trade.module");
let TickerModule = class TickerModule {
};
TickerModule = tslib_1.__decorate([
    common_1.Module({
        providers: [common_1.Logger, ticker_service_1.TickerService, ticker_console_1.TickerConsole],
        controllers: [ticker_controller_1.TickerController],
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
            database_common_1.DatabaseCommonModule,
            funding_module_1.FundingModule,
            instrument_module_1.InstrumentModule,
            index_module_1.IndexModule,
            trade_module_1.TradeModule,
        ],
        exports: [],
    })
], TickerModule);
exports.TickerModule = TickerModule;
//# sourceMappingURL=ticker.module.js.map