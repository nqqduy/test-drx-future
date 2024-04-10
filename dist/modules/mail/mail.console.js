"use strict";
var MailConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailConsole = void 0;
const tslib_1 = require("tslib");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const mail_config_1 = require("../../configs/mail.config");
const mail_processor_1 = require("./mail.processor");
const mail_service_1 = require("./mail.service");
let MailConsole = MailConsole_1 = class MailConsole {
    constructor(mailerService, mailService, logger) {
        this.mailerService = mailerService;
        this.mailService = mailService;
        this.logger = logger;
        this.logger.setContext(MailConsole_1.name);
    }
    async sendMail(email, subject, body) {
        await this.mailerService.sendMail({
            from: mail_config_1.mailConfig.from,
            to: email,
            subject: subject,
            template: 'src/modules/mail/templates/test-email.hbs',
            context: {
                email: email,
                content: body,
                bannerLink: mail_processor_1.MailProcessor.MAIL_BANNER_LINK,
            },
        });
    }
    async sendMailViaQueue(email, subject, body) {
        await this.mailService.sendTestEmail(email, subject, body);
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'email:send <email> <subject> <body>',
        description: 'Send test email',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MailConsole.prototype, "sendMail", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'email:send-via-queue <email> <subject> <body>',
        description: 'Send test email via queue',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MailConsole.prototype, "sendMailViaQueue", null);
MailConsole = MailConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [mailer_1.MailerService,
        mail_service_1.MailService,
        common_1.Logger])
], MailConsole);
exports.MailConsole = MailConsole;
//# sourceMappingURL=mail.console.js.map