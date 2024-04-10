"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redis_config_1 = require("../../configs/redis.config");
const database_common_1 = require("../../models/database-common");
const master_data_controller_1 = require("./master-data.controller");
const master_data_service_1 = require("./master-data.service");
const redisStore = require("cache-manager-redis-store");
const trading_rules_module_1 = require("../trading-rules/trading-rules.module");
const coin_info_module_1 = require("../coin-info/coin-info.module");
const leverage_margin_module_1 = require("../leverage-margin/leverage-margin.module");
const instrument_module_1 = require("../instrument/instrument.module");
let MasterDataModule = class MasterDataModule {
};
MasterDataModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
            database_common_1.DatabaseCommonModule,
            trading_rules_module_1.TradingRulesModule,
            coin_info_module_1.CoinInfoModule,
            leverage_margin_module_1.LeverageModule,
            instrument_module_1.InstrumentModule,
        ],
        controllers: [master_data_controller_1.MasterDataController],
        providers: [master_data_service_1.MasterDataService],
        exports: [master_data_service_1.MasterDataService],
    })
], MasterDataModule);
exports.MasterDataModule = MasterDataModule;
//# sourceMappingURL=master-data.module.js.map