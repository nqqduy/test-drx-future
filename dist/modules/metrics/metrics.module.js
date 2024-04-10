"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
const metrics_controller_1 = require("./metrics.controller");
const metrics_service_1 = require("./metrics.service");
const redis_config_1 = require("../../configs/redis.config");
const redisStore = require("cache-manager-redis-store");
let MetricsModule = class MetricsModule {
};
MetricsModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
        ],
        controllers: [metrics_controller_1.MetricsController],
        providers: [
            {
                provide: 'PROM_REGISTRY',
                useValue: new prom_client_1.Registry(),
            },
            metrics_service_1.MetricsService,
        ],
    })
], MetricsModule);
exports.MetricsModule = MetricsModule;
//# sourceMappingURL=metrics.module.js.map