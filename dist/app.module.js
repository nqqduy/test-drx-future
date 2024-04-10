"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModules = void 0;
const tslib_1 = require("tslib");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const modules_1 = require("./modules");
const logger_middleware_1 = require("./shares/middlewares/logger.middleware");
const balance_module_1 = require("./modules/balance/balance.module");
const mail_module_1 = require("./modules/mail/mail.module");
let AppModules = class AppModules {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).exclude('/api/v1/ping').forRoutes('/');
    }
};
AppModules = tslib_1.__decorate([
    common_1.Module({
        imports: [
            ...modules_1.default,
            balance_module_1.BalanceModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: Number(process.env.MAIL_PORT),
                    secure: true,
                    auth: {
                        user: process.env.MAIL_ACCOUNT,
                        pass: process.env.MAIL_PASSWORD,
                    },
                    debug: true,
                },
            }),
            mail_module_1.MailModule,
        ],
        controllers: [],
        providers: [common_1.Logger],
    })
], AppModules);
exports.AppModules = AppModules;
//# sourceMappingURL=app.module.js.map