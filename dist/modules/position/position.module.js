"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const account_module_1 = require("../account/account.module");
const position_controller_1 = require("./position.controller");
const position_service_1 = require("./position.service");
const index_module_1 = require("../index/index.module");
const instrument_module_1 = require("../instrument/instrument.module");
const trading_rules_module_1 = require("../trading-rules/trading-rules.module");
const position_console_1 = require("./position.console");
let PositionModule = class PositionModule {
};
PositionModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            account_module_1.AccountsModule,
            instrument_module_1.InstrumentModule,
            trading_rules_module_1.TradingRulesModule,
            index_module_1.IndexModule,
        ],
        providers: [position_service_1.PositionService, position_console_1.PositionConsole],
        controllers: [position_controller_1.PositionController],
        exports: [position_service_1.PositionService],
    })
], PositionModule);
exports.PositionModule = PositionModule;
//# sourceMappingURL=position.module.js.map