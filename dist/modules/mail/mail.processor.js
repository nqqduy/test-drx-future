"use strict";
var MailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailProcessor = void 0;
const tslib_1 = require("tslib");
const mailer_1 = require("@nestjs-modules/mailer");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const configs_1 = require("../../configs");
const mail_config_1 = require("../../configs/mail.config");
const liquidation_call_dto_1 = require("./dto/liquidation-call.dto");
const test_mail_dto_1 = require("./dto/test-mail.dto");
const update_email_dto_1 = require("./dto/update-email.dto");
const users_service_1 = require("../user/users.service");
const funding_service_1 = require("../funding/funding.service");
let MailProcessor = MailProcessor_1 = class MailProcessor {
    constructor(mailerService, userService, fundingService, logger) {
        this.mailerService = mailerService;
        this.userService = userService;
        this.fundingService = fundingService;
        this.logger = logger;
    }
    async sendVerifyEmail({ data }) {
        this.logger.log(`Start job: sendUpdateEmail user ${data.userId} email ${data.email}`);
        const antiPhishingCode = await this.userService.getAntiPhishingCode(data.userId);
        const context = {
            email: data.email,
            confirmLink: data.confirmLink,
            bannerLink: MailProcessor_1.MAIL_BANNER_LINK,
            walletAddress: data.walletAddress,
        };
        if (antiPhishingCode) {
            context['antiPhishingCode'] = antiPhishingCode;
        }
        if (data.oldEmail) {
            context['oldEmail'] = data.oldEmail;
        }
        try {
            await this.mailerService.sendMail({
                from: mail_config_1.mailConfig.from,
                to: data.email,
                subject: `Lagom - Email ${data.oldEmail ? 'Update' : 'Confirmation'}`,
                template: `src/modules/mail/templates/${data.oldEmail ? 'update-email' : 'verify-email'}.hbs`,
                context: context,
            });
        }
        catch (e) {
            this.logger.debug(e);
        }
        this.logger.log(`Done job: sendUpdateEmail ${data.userId} email ${data.email}`);
        return 1;
    }
    async sendLiquidationCall(job) {
        this.logger.debug('Start job: sendLiquidationCall');
        const liquidationDto = job.data;
        const user = await this.userService.findUserById(liquidationDto.userId);
        if (!user || !user.email) {
            this.logger.log(`User ${user.id} do not have an email`);
            this.logger.log('Done job: sendLiquidationCall');
            return 1;
        }
        this.logger.log(`Sending liquidation email of market ${liquidationDto.market} to ${user.email}`);
        try {
            await this.mailerService.sendMail({
                from: mail_config_1.mailConfig.from,
                to: user.email,
                subject: 'Lagom - Liquidation Notification',
                template: 'src/modules/mail/templates/liquidation-call.hbs',
                context: {
                    email: user.email,
                    side: liquidationDto.side,
                    size: liquidationDto.size,
                    market: liquidationDto.market,
                    bannerLink: MailProcessor_1.MAIL_BANNER_LINK,
                    antiPhishingCode: (user === null || user === void 0 ? void 0 : user.antiPhishingCode) || null,
                },
            });
        }
        catch (e) {
            this.logger.debug(e);
        }
        this.logger.log('Done job: sendLiquidationCall');
        return 1;
    }
    async sendTestMail(job) {
        this.logger.debug('Start job: sendTestMail');
        const testMailDto = job.data;
        this.logger.log(`Sending test email to ${testMailDto.email}`);
        try {
            await this.mailerService.sendMail({
                from: mail_config_1.mailConfig.from,
                to: testMailDto.email,
                subject: testMailDto.subject,
                template: 'src/modules/mail/templates/test-email.hbs',
                context: {
                    email: testMailDto.email,
                    content: testMailDto.content,
                    bannerLink: MailProcessor_1.MAIL_BANNER_LINK,
                },
            });
        }
        catch (e) {
            this.logger.debug(e);
        }
        this.logger.log('Done job: sendTestMail');
        return 1;
    }
    async sendMailFundingFee(job) {
        this.logger.debug('Start job: sendMailFundingFee');
        const _a = job.data, { email, fundingRate, exchangeLink, phoneSupport, emailSupport, symbols, singular, footerImage, bannerImage, many } = _a, objI18nT = tslib_1.__rest(_a, ["email", "fundingRate", "exchangeLink", "phoneSupport", "emailSupport", "symbols", "singular", "footerImage", "bannerImage", "many"]);
        this.logger.log(`Sending test email to ${email}`);
        try {
            await this.mailerService.sendMail({
                from: mail_config_1.mailConfig.from,
                to: email,
                subject: objI18nT.key_funding_0,
                template: 'src/modules/mail/templates/fundingFee.hbs',
                context: Object.assign({ email,
                    fundingRate,
                    exchangeLink,
                    emailSupport,
                    phoneSupport,
                    symbols,
                    singular,
                    bannerImage,
                    footerImage,
                    many, antiPhishingCode: await this.userService.getAntiPhishingCodeByEmail(email) }, objI18nT),
            });
        }
        catch (e) {
            this.logger.debug(e);
        }
        this.logger.log('Done job: sendMailFundingFee');
        return 1;
    }
    async sendTriggeredMail(job) {
        this.logger.debug('Start job: sendTriggeredMail');
        const _a = job.data, { email, order, trigger, exchangeLink, contractType, emailSupport, phoneSupport, time, tpSlPrice, type } = _a, objI18nT = tslib_1.__rest(_a, ["email", "order", "trigger", "exchangeLink", "contractType", "emailSupport", "phoneSupport", "time", "tpSlPrice", "type"]);
        this.logger.log(`Sending test email to ${email}`);
        try {
            await this.mailerService.sendMail({
                to: email,
                from: mail_config_1.mailConfig.from,
                subject: objI18nT.key_TpSl_0,
                template: 'src/modules/mail/templates/TpslStopOrder.hbs',
                context: Object.assign({ email,
                    order,
                    trigger,
                    time,
                    contractType,
                    exchangeLink,
                    emailSupport,
                    phoneSupport,
                    tpSlPrice,
                    type, antiPhishingCode: await this.userService.getAntiPhishingCodeByEmail(email) }, objI18nT),
            });
        }
        catch (e) {
            this.logger.debug(e);
        }
        this.logger.log('Done job: sendTriggeredMail');
        return 1;
    }
    async sendFundingMailAndAddToQueue(job) {
        this.logger.debug('Start job: sendFundingMailAndAddToQueue');
        const { dataFundingRates } = job.data;
        try {
            await this.fundingService.sendMailFundingFee(dataFundingRates);
        }
        catch (e) {
            this.logger.debug(e);
        }
        this.logger.log('Done job: sendTriggeredMail');
        return 1;
    }
};
MailProcessor.MAIL_BANNER_LINK = `${configs_1.getConfig().get('mail.domain')}banner.png`;
tslib_1.__decorate([
    bull_1.Process('sendUpdateEmail'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailProcessor.prototype, "sendVerifyEmail", null);
tslib_1.__decorate([
    bull_1.Process('sendLiquidationCall'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailProcessor.prototype, "sendLiquidationCall", null);
tslib_1.__decorate([
    bull_1.Process('sendTestMail'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailProcessor.prototype, "sendTestMail", null);
tslib_1.__decorate([
    bull_1.Process('sendMailFundingFee'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailProcessor.prototype, "sendMailFundingFee", null);
tslib_1.__decorate([
    bull_1.Process('sendTriggeredMail'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailProcessor.prototype, "sendTriggeredMail", null);
tslib_1.__decorate([
    bull_1.Process('sendFundingMailAndAddToQueue'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailProcessor.prototype, "sendFundingMailAndAddToQueue", null);
MailProcessor = MailProcessor_1 = tslib_1.__decorate([
    bull_1.Processor('mail'),
    tslib_1.__metadata("design:paramtypes", [mailer_1.MailerService,
        users_service_1.UserService,
        funding_service_1.FundingService,
        common_1.Logger])
], MailProcessor);
exports.MailProcessor = MailProcessor;
//# sourceMappingURL=mail.processor.js.map