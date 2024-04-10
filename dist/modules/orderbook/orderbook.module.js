"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const database_common_1 = require("../../models/database-common");
const orderbook_console_1 = require("./orderbook.console");
const orderbook_controller_1 = require("./orderbook.controller");
const orderbook_service_1 = require("./orderbook.service");
let OrderbookModule = class OrderbookModule {
};
OrderbookModule = tslib_1.__decorate([
    common_1.Module({
        providers: [common_1.Logger, orderbook_service_1.OrderbookService, orderbook_console_1.OrderbookConsole],
        controllers: [orderbook_controller_1.OrderbookController],
        imports: [
            common_1.CacheModule.register({
                store: redisStore,
                host: redis_config_1.redisConfig.host,
                port: redis_config_1.redisConfig.port,
            }),
            database_common_1.DatabaseCommonModule,
        ],
        exports: [orderbook_service_1.OrderbookService],
    })
], OrderbookModule);
exports.OrderbookModule = OrderbookModule;
//# sourceMappingURL=orderbook.module.js.map