"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redis_config_1 = require("../../configs/redis.config");
const account_module_1 = require("../account/account.module");
const instrument_module_1 = require("../instrument/instrument.module");
const order_controller_1 = require("./order.controller");
const order_service_1 = require("./order.service");
const position_module_1 = require("../position/position.module");
const users_module_1 = require("../user/users.module");
const trade_module_1 = require("../trade/trade.module");
const redisStore = require("cache-manager-redis-store");
const order_console_1 = require("./order.console");
const trading_rules_module_1 = require("../trading-rules/trading-rules.module");
let OrderModule = class OrderModule {
};
OrderModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.Logger,
            account_module_1.AccountsModule,
            instrument_module_1.InstrumentModule,
            position_module_1.PositionModule,
            users_module_1.UsersModule,
            trade_module_1.TradeModule,
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            trading_rules_module_1.TradingRulesModule,
        ],
        providers: [order_service_1.OrderService, common_1.Logger, order_console_1.OrderConsole],
        controllers: [order_controller_1.OrderController],
        exports: [order_service_1.OrderService],
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map