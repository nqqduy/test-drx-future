"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingModule = void 0;
const tslib_1 = require("tslib");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const utils_1 = require("ethers/lib/utils");
const nestjs_redis_1 = require("nestjs-redis");
const mail_config_1 = require("../../configs/mail.config");
const redis_config_1 = require("../../configs/redis.config");
const account_module_1 = require("../account/account.module");
const funding_console_1 = require("./funding.console");
const funding_controller_1 = require("./funding.controller");
const funding_service_1 = require("./funding.service");
const orderbook_module_1 = require("../orderbook/orderbook.module");
const instrument_module_1 = require("../instrument/instrument.module");
const leverage_margin_module_1 = require("../leverage-margin/leverage-margin.module");
const mail_console_1 = require("../mail/mail.console");
const mail_module_1 = require("../mail/mail.module");
const mail_processor_1 = require("../mail/mail.processor");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../matching-engine/notifications.service");
const user_setting_service_1 = require("../user-setting/user-setting.service");
const users_service_1 = require("../user/users.service");
const bullOptions = { name: 'mail' };
const providers = [mail_service_1.MailService, mail_console_1.MailConsole, utils_1.Logger, users_service_1.UserService, user_setting_service_1.UserSettingeService];
if (mail_config_1.mailConfig.enable) {
    providers.push(mail_processor_1.MailProcessor);
}
else {
    bullOptions['processors'] = [];
}
let FundingModule = class FundingModule {
};
FundingModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            nestjs_redis_1.RedisModule.register(Object.assign({}, redis_config_1.redisConfig)),
            bull_1.BullModule.registerQueue(bullOptions),
            orderbook_module_1.OrderbookModule,
            account_module_1.AccountsModule,
            leverage_margin_module_1.LeverageModule,
            mail_module_1.MailModule,
            common_1.forwardRef(() => instrument_module_1.InstrumentModule),
        ],
        providers: [funding_service_1.FundingService, funding_console_1.FundingConsole, notifications_service_1.NotificationService, users_service_1.UserService],
        controllers: [funding_controller_1.FundingController],
        exports: [funding_service_1.FundingService],
    })
], FundingModule);
exports.FundingModule = FundingModule;
//# sourceMappingURL=funding.module.js.map