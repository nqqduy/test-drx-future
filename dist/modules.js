"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const redisStore = require("cache-manager-redis-store");
const nestjs_console_1 = require("nestjs-console");
const database_config_1 = require("./configs/database.config");
const redis_config_1 = require("./configs/redis.config");
const database_common_1 = require("./models/database-common");
const account_module_1 = require("./modules/account/account.module");
const auth_module_1 = require("./modules/auth/auth.module");
const candle_module_1 = require("./modules/candle/candle.module");
const dex_module_1 = require("./modules/dex/dex.module");
const event_module_1 = require("./modules/events/event.module");
const funding_module_1 = require("./modules/funding/funding.module");
const health_module_1 = require("./modules/health/health.module");
const index_module_1 = require("./modules/index/index.module");
const instrument_module_1 = require("./modules/instrument/instrument.module");
const latest_block_module_1 = require("./modules/latest-block/latest-block.module");
const mail_module_1 = require("./modules/mail/mail.module");
const matching_engine_module_1 = require("./modules/matching-engine/matching-engine.module");
const order_module_1 = require("./modules/order/order.module");
const orderbook_module_1 = require("./modules/orderbook/orderbook.module");
const position_module_1 = require("./modules/position/position.module");
const setting_module_1 = require("./modules/setting/setting.module");
const ticker_module_1 = require("./modules/ticker/ticker.module");
const trade_module_1 = require("./modules/trade/trade.module");
const transaction_module_1 = require("./modules/transaction/transaction.module");
const users_module_1 = require("./modules/user/users.module");
const http_module_1 = require("./shares/http-clients/http.module");
const kafka_module_1 = require("./shares/kafka-client/kafka-module");
const coin_info_module_1 = require("./modules/coin-info/coin-info.module");
const access_token_module_1 = require("./modules/access-token/access-token.module");
const trading_rules_module_1 = require("./modules/trading-rules/trading-rules.module");
const leverage_margin_module_1 = require("./modules/leverage-margin/leverage-margin.module");
const user_margin_mode_module_1 = require("./modules/user-margin-mode/user-margin-mode.module");
const user_setting_module_1 = require("./modules/user-setting/user-setting.module");
const master_data_module_1 = require("./modules/master-data/master-data.module");
const metrics_module_1 = require("./modules/metrics/metrics.module");
const assets_module_1 = require("./modules/assets/assets.module");
const spot_modules_1 = require("./modules/spot/spot.modules");
const translate_module_1 = require("./modules/translate/translate.module");
const Modules = [
    common_1.Logger,
    typeorm_1.TypeOrmModule.forRoot(database_config_1.masterConfig),
    typeorm_1.TypeOrmModule.forRoot(database_config_1.reportConfig),
    schedule_1.ScheduleModule.forRoot(),
    database_common_1.DatabaseCommonModule,
    kafka_module_1.KafkaModule,
    nestjs_console_1.ConsoleModule,
    http_module_1.HttpClientModule,
    bull_1.BullModule.forRoot({
        redis: redis_config_1.redisConfig,
    }),
    common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
    event_module_1.EventModule,
    auth_module_1.AuthModule,
    health_module_1.HealthModule,
    users_module_1.UsersModule,
    account_module_1.AccountsModule,
    order_module_1.OrderModule,
    instrument_module_1.InstrumentModule,
    position_module_1.PositionModule,
    index_module_1.IndexModule,
    funding_module_1.FundingModule,
    dex_module_1.DexModule,
    matching_engine_module_1.MatchingEngineModule,
    orderbook_module_1.OrderbookModule,
    ticker_module_1.TickerModule,
    trade_module_1.TradeModule,
    latest_block_module_1.LatestBlockModule,
    candle_module_1.CandleModule,
    transaction_module_1.TransactionModule,
    mail_module_1.MailModule,
    setting_module_1.SettingModule,
    coin_info_module_1.CoinInfoModule,
    access_token_module_1.AccessTokenModule,
    user_margin_mode_module_1.UserMarginModeModule,
    user_setting_module_1.UserSettingModule,
    trading_rules_module_1.TradingRulesModule,
    leverage_margin_module_1.LeverageModule,
    master_data_module_1.MasterDataModule,
    metrics_module_1.MetricsModule,
    assets_module_1.AssetsModule,
    spot_modules_1.SpotModule,
    translate_module_1.TranslateModule,
];
exports.default = Modules;
//# sourceMappingURL=modules.js.map