"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingRulesModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const database_common_1 = require("../../models/database-common");
const trading_rule_service_1 = require("./trading-rule.service");
const trading_rules_controller_1 = require("./trading-rules.controller");
const redis_config_1 = require("../../configs/redis.config");
const redisStore = require("cache-manager-redis-store");
let TradingRulesModule = class TradingRulesModule {
};
TradingRulesModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
            database_common_1.DatabaseCommonModule,
        ],
        controllers: [trading_rules_controller_1.TradingRulesController],
        providers: [trading_rule_service_1.TradingRulesService],
        exports: [trading_rule_service_1.TradingRulesService],
    })
], TradingRulesModule);
exports.TradingRulesModule = TradingRulesModule;
//# sourceMappingURL=trading-rules.module.js.map