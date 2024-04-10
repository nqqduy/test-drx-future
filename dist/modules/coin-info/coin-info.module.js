"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfoModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const coin_info_console_1 = require("./coin-info.console");
const coin_info_service_1 = require("./coin-info.service");
const coin_info_controller_1 = require("./coin-info.controller");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
let CoinInfoModule = class CoinInfoModule {
};
CoinInfoModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
        ],
        providers: [common_1.Logger, coin_info_service_1.CoinInfoService, coin_info_console_1.CoinInfoConsole],
        exports: [coin_info_service_1.CoinInfoService],
        controllers: [coin_info_controller_1.CoinInfoController],
    })
], CoinInfoModule);
exports.CoinInfoModule = CoinInfoModule;
//# sourceMappingURL=coin-info.module.js.map