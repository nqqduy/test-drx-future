"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const instrument_controller_1 = require("./instrument.controller");
const instrument_service_1 = require("./instrument.service");
const instrument_console_1 = require("./instrument.console");
const redis_config_1 = require("../../configs/redis.config");
const redisStore = require("cache-manager-redis-store");
const funding_module_1 = require("../funding/funding.module");
let InstrumentModule = class InstrumentModule {
};
InstrumentModule = tslib_1.__decorate([
    common_1.Module({
        providers: [instrument_service_1.InstrumentService, common_1.Logger, instrument_console_1.default],
        controllers: [instrument_controller_1.InstrumentController],
        exports: [instrument_service_1.InstrumentService],
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
            common_1.forwardRef(() => funding_module_1.FundingModule),
        ],
    })
], InstrumentModule);
exports.InstrumentModule = InstrumentModule;
//# sourceMappingURL=instrument.module.js.map