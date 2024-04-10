"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const account_module_1 = require("../account/account.module");
const funding_module_1 = require("../funding/funding.module");
const index_module_1 = require("../index/index.module");
const instrument_module_1 = require("../instrument/instrument.module");
const mail_module_1 = require("../mail/mail.module");
const matching_engine_test_console_1 = require("./matching-engine-test.console");
const matching_engine_console_1 = require("./matching-engine.console");
const matching_engine_service_1 = require("./matching-engine.service");
const notifications_service_1 = require("./notifications.service");
const order_controller_1 = require("../order/order.controller");
const order_module_1 = require("../order/order.module");
const position_module_1 = require("../position/position.module");
const trade_module_1 = require("../trade/trade.module");
const transaction_module_1 = require("../transaction/transaction.module");
const leverage_margin_module_1 = require("../leverage-margin/leverage-margin.module");
const balance_module_1 = require("../balance/balance.module");
const user_setting_module_1 = require("../user-setting/user-setting.module");
const user_setting_service_1 = require("../user-setting/user-setting.service");
const nestjs_redis_1 = require("nestjs-redis");
const users_module_1 = require("../user/users.module");
let MatchingEngineModule = class MatchingEngineModule {
};
MatchingEngineModule = tslib_1.__decorate([
    common_1.Module({
        providers: [
            common_1.Logger,
            matching_engine_service_1.MatchingEngineService,
            matching_engine_console_1.MatchingEngineConsole,
            matching_engine_test_console_1.MatchingEngineTestConsole,
            notifications_service_1.NotificationService,
            user_setting_service_1.UserSettingeService,
        ],
        controllers: [order_controller_1.OrderController],
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            nestjs_redis_1.RedisModule.register(Object.assign({}, redis_config_1.redisConfig)),
            account_module_1.AccountsModule,
            funding_module_1.FundingModule,
            index_module_1.IndexModule,
            instrument_module_1.InstrumentModule,
            order_module_1.OrderModule,
            position_module_1.PositionModule,
            trade_module_1.TradeModule,
            transaction_module_1.TransactionModule,
            mail_module_1.MailModule,
            leverage_margin_module_1.LeverageModule,
            balance_module_1.BalanceModule,
            mail_module_1.MailModule,
            user_setting_module_1.UserSettingModule,
            common_1.HttpModule,
            users_module_1.UsersModule,
        ],
        exports: [],
    })
], MatchingEngineModule);
exports.MatchingEngineModule = MatchingEngineModule;
//# sourceMappingURL=matching-engine.module.js.map