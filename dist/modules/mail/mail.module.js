"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const tslib_1 = require("tslib");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const path_1 = require("path");
const mail_config_1 = require("../../configs/mail.config");
const redis_config_1 = require("../../configs/redis.config");
const mail_console_1 = require("./mail.console");
const mail_processor_1 = require("./mail.processor");
const mail_service_1 = require("./mail.service");
const users_service_1 = require("../user/users.service");
const user_setting_service_1 = require("../user-setting/user-setting.service");
const translate_module_1 = require("../translate/translate.module");
const funding_service_1 = require("../funding/funding.service");
const leverage_margin_service_1 = require("../leverage-margin/leverage-margin.service");
const notifications_service_1 = require("../matching-engine/notifications.service");
const bullOptions = { name: 'mail' };
const providers = [
    mail_service_1.MailService,
    mail_console_1.MailConsole,
    common_1.Logger,
    users_service_1.UserService,
    user_setting_service_1.UserSettingeService,
    funding_service_1.FundingService,
    leverage_margin_service_1.LeverageMarginService,
    notifications_service_1.NotificationService,
];
if (mail_config_1.mailConfig.enable) {
    providers.push(mail_processor_1.MailProcessor);
}
else {
    bullOptions['processors'] = [];
}
let MailModule = class MailModule {
};
MailModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.HttpModule,
            mailer_1.MailerModule.forRoot({
                transport: mail_config_1.mailConfig,
                defaults: {
                    from: mail_config_1.mailConfig.from,
                },
                template: {
                    dir: path_1.join(__dirname, 'templates'),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            bull_1.BullModule.registerQueue(bullOptions),
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            translate_module_1.TranslateModule,
        ],
        providers: providers,
        exports: [mail_service_1.MailService],
    })
], MailModule);
exports.MailModule = MailModule;
//# sourceMappingURL=mail.module.js.map