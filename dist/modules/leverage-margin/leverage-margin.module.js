"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeverageModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redis_config_1 = require("../../configs/redis.config");
const leverage_margin_controller_1 = require("./leverage-margin.controller");
const leverage_margin_service_1 = require("./leverage-margin.service");
const redisStore = require("cache-manager-redis-store");
let LeverageModule = class LeverageModule {
};
LeverageModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.Logger,
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
        ],
        providers: [leverage_margin_service_1.LeverageMarginService, common_1.Logger],
        controllers: [leverage_margin_controller_1.LeverageMarginController],
        exports: [leverage_margin_service_1.LeverageMarginService],
    })
], LeverageModule);
exports.LeverageModule = LeverageModule;
//# sourceMappingURL=leverage-margin.module.js.map