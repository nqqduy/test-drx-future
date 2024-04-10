"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const candle_console_1 = require("./candle.console");
const candle_controller_1 = require("./candle.controller");
const candle_service_1 = require("./candle.service");
const instrument_module_1 = require("../instrument/instrument.module");
let CandleModule = class CandleModule {
};
CandleModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            instrument_module_1.InstrumentModule,
        ],
        providers: [candle_service_1.CandleService, candle_console_1.CandleConsole],
        exports: [candle_service_1.CandleService],
        controllers: [candle_controller_1.CandlesController],
    })
], CandleModule);
exports.CandleModule = CandleModule;
//# sourceMappingURL=candle.module.js.map