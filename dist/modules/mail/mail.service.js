"use strict";
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const tslib_1 = require("tslib");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const rxjs_1 = require("rxjs");
const configs_1 = require("../../configs");
const user_entity_1 = require("../../models/entities/user.entity");
const liquidation_call_dto_1 = require("./dto/liquidation-call.dto");
const test_mail_dto_1 = require("./dto/test-mail.dto");
const update_email_dto_1 = require("./dto/update-email.dto");
const setting_enum_1 = require("../../shares/enums/setting.enum");
const exceptions_1 = require("../../shares/exceptions");
const axios_1 = require("@nestjs/axios");
const order_entity_1 = require("../../models/entities/order.entity");
const user_setting_service_1 = require("../user-setting/user-setting.service");
const order_enum_1 = require("../../shares/enums/order.enum");
const typeorm_1 = require("@nestjs/typeorm");
const user_setting_repository_1 = require("../../models/repositories/user-setting.repository");
const moment = require("moment");
const transaction_const_1 = require("../transaction/transaction.const");
const translate_service_1 = require("../translate/translate.service");
const KeyJSONTranslate = require("../../i18n/en/translate.json");
const user_repository_1 = require("../../models/repositories/user.repository");
let MailService = MailService_1 = class MailService {
    constructor(emailQueue, redisService, cacheManager, httpService, userSettingService, userSettingMasterReport, i18n, usersRepositoryMaster) {
        this.emailQueue = emailQueue;
        this.redisService = redisService;
        this.cacheManager = cacheManager;
        this.httpService = httpService;
        this.userSettingService = userSettingService;
        this.userSettingMasterReport = userSettingMasterReport;
        this.i18n = i18n;
        this.usersRepositoryMaster = usersRepositoryMaster;
    }
    async checkWaitTime(userId) {
        const isWait = await this.redisService.getClient().get(`${MailService_1.WAIT_PREFIX}${userId}`);
        if (isWait) {
            throw new common_1.HttpException(Object.assign(Object.assign({}, exceptions_1.httpErrors.EMAIL_WAIT_TIME), { waitUntil: Number(isWait) + 60000 }), common_1.HttpStatus.BAD_REQUEST);
        }
        return isWait;
    }
    async getPendingEmail(userId) {
        const keys = await this.redisService.getClient().keys(`${MailService_1.MAIL_PREFIX}*`);
        if (keys.length == 0)
            return null;
        for (let i = keys.length - 1; i >= 0; i--) {
            const dto = JSON.parse(await this.redisService.getClient().get(keys[i]));
            if (dto.oldEmail === userId.email)
                return dto.email;
        }
        return null;
    }
    async sendLiquidationCall(liquidationDto) {
        await this.emailQueue.add('sendLiquidationCall', Object.assign({}, liquidationDto));
    }
    async sendTestEmail(email, subject, content) {
        const testMailDto = { email, subject, content };
        await this.emailQueue.add('sendTestMail', Object.assign({}, testMailDto));
    }
    async getQueueStats() {
        const activeCount = await this.emailQueue.getActiveCount();
        const failedCount = await this.emailQueue.getFailedCount();
        const waitingCount = await this.emailQueue.getWaitingCount();
        return {
            activeCount,
            failedCount,
            waitingCount,
        };
    }
    async sendMailTpslStopOrder(email, order, trigger, exchangeLink, emailSupport, phoneSupport, bannerImage, footerImage) {
        try {
            const time = moment.utc(order.updatedAt).format('YYYY-MM-DD HH:mm:ss');
            const tpSlPrice = order.tpSLPrice;
            const type = order.type.toLowerCase();
            let contractType = 'USD-M';
            const isCoiM = transaction_const_1.LIST_SYMBOL_COINM.includes(order.symbol);
            if (isCoiM) {
                contractType = 'COIN-M';
            }
            const objI18nT = {};
            const user = await this.usersRepositoryMaster.findOne({ where: { email } });
            for (const key of Object.keys(KeyJSONTranslate)) {
                objI18nT[key] = await this.i18n.translate(user, key, { email });
            }
            await this.emailQueue.add('sendTriggeredMail', Object.assign({ email,
                order,
                trigger,
                exchangeLink,
                contractType,
                emailSupport,
                phoneSupport,
                time,
                tpSlPrice,
                type,
                bannerImage,
                footerImage }, objI18nT));
        }
        catch (error) {
            console.log('======error add queue send mail', error);
        }
    }
    async sendMailFundingFee(email, fundingRate, symbols) {
        let phoneSupport = await this.cacheManager.get(`${setting_enum_1.MAIL.PHONE_SUPPORT}`);
        let emailSupport = await this.cacheManager.get(`${setting_enum_1.MAIL.EMAIL_SUPPORT}`);
        let bannerImage = await this.cacheManager.get(`${setting_enum_1.MAIL.BANNER_IMAGE}`);
        let footerImage = await this.cacheManager.get(`${setting_enum_1.MAIL.FOOTER_IMAGE}`);
        const exchangeLink = setting_enum_1.MAIL.EXCHANGE_SITE;
        fundingRate = Number(fundingRate).toFixed(3);
        if (!phoneSupport || emailSupport) {
            const url = `${process.env.SPOT_URL_API}/api/v1/site-settings`;
            console.log('url: ', url);
            const result = await rxjs_1.lastValueFrom(this.httpService.get(url).pipe(rxjs_1.map((response) => response.data)));
            if (!result.data)
                return;
            await this.cacheManager.set(`${setting_enum_1.MAIL.PHONE_SUPPORT}`, result.data.contact_phone, {
                ttl: Number.MAX_SAFE_INTEGER,
            });
            await this.cacheManager.set(`${setting_enum_1.MAIL.EMAIL_SUPPORT}`, result.data.contact_email, {
                ttl: Number.MAX_SAFE_INTEGER,
            });
            phoneSupport = result.data.contact_phone;
            emailSupport = result.data.contact_email;
        }
        if (!bannerImage || !footerImage) {
            const url = `${process.env.SPOT_URL_API}/api/v1/get-image-mail`;
            const result = await rxjs_1.lastValueFrom(this.httpService.get(url).pipe(rxjs_1.map((response) => response.data)));
            if (!result.data)
                return;
            await this.cacheManager.set(`${setting_enum_1.MAIL.BANNER_IMAGE}`, result.data.header, {
                ttl: Number.MAX_SAFE_INTEGER,
            });
            await this.cacheManager.set(`${setting_enum_1.MAIL.FOOTER_IMAGE}`, result.data.footer, {
                ttl: Number.MAX_SAFE_INTEGER,
            });
            bannerImage = result.data.header;
            footerImage = result.data.footer;
        }
        let singular = false;
        let many = false;
        if (symbols.length > 1) {
            many = true;
        }
        if (symbols.length == 1) {
            singular = true;
        }
        const objI18nT = {};
        const user = await this.usersRepositoryMaster.findOne({ where: { email } });
        for (const key of Object.keys(KeyJSONTranslate)) {
            objI18nT[key] = await this.i18n.translate(user, key, { email });
        }
        await this.emailQueue.add('sendMailFundingFee', Object.assign({ email,
            fundingRate,
            exchangeLink,
            phoneSupport,
            emailSupport,
            symbols, singular: singular, many: many, bannerImage,
            footerImage }, objI18nT));
    }
    async sendMailWhenTpSlOrderTriggered(command) {
        for (const order of command.orders) {
            Object.assign(order, order_entity_1.OrderEntity);
            const conditionSendMailTrigger = order.isTriggered &&
                (order.tpSLType == order_enum_1.OrderType.TAKE_PROFIT_MARKET ||
                    (order.tpSLType == order_enum_1.OrderType.STOP_MARKET &&
                        (order.isClosePositionOrder == true || order.isTpSlOrder == true)));
            if (conditionSendMailTrigger) {
                try {
                    const { userNotificationSettings, user } = await this.userSettingService.getUserSettingByUserId(order.userId);
                    if (!userNotificationSettings || !user) {
                        continue;
                    }
                    if (Number(userNotificationSettings.notificationQuantity) >= setting_enum_1.TP_SL_NOTIFICATION.QUANTITY) {
                        continue;
                    }
                    if (!userNotificationSettings.stopLossTrigger) {
                        continue;
                    }
                    const trigger = order.trigger === order_enum_1.OrderTrigger.ORACLE ? 'Mark' : 'Last';
                    let phoneSupport = await this.cacheManager.get(`${setting_enum_1.MAIL.PHONE_SUPPORT}`);
                    let emailSupport = await this.cacheManager.get(`${setting_enum_1.MAIL.EMAIL_SUPPORT}`);
                    const exchangeLink = setting_enum_1.MAIL.EXCHANGE_SITE;
                    if (!phoneSupport || !emailSupport) {
                        const url = `${process.env.SPOT_URL_API}/api/v1/site-settings`;
                        const result = await rxjs_1.lastValueFrom(this.httpService.get(url).pipe(rxjs_1.map((response) => response.data)));
                        if (!result.data) {
                            continue;
                        }
                        if (result.data.contact_phone) {
                            await this.cacheManager.set(`${setting_enum_1.MAIL.PHONE_SUPPORT}`, result.data.contact_phone, {
                                ttl: Number.MAX_SAFE_INTEGER,
                            });
                        }
                        if (result.data.contact_email) {
                            await this.cacheManager.set(`${setting_enum_1.MAIL.EMAIL_SUPPORT}`, result.data.contact_email, {
                                ttl: Number.MAX_SAFE_INTEGER,
                            });
                        }
                        phoneSupport = result.data.contact_phone;
                        emailSupport = result.data.contact_email;
                    }
                    let bannerImage = await this.cacheManager.get(`${setting_enum_1.MAIL.BANNER_IMAGE}`);
                    let footerImage = await this.cacheManager.get(`${setting_enum_1.MAIL.FOOTER_IMAGE}`);
                    if (!bannerImage || !footerImage) {
                        const url = `${process.env.SPOT_URL_API}/api/v1/get-image-mail`;
                        const result = await rxjs_1.lastValueFrom(this.httpService.get(url).pipe(rxjs_1.map((response) => response.data)));
                        if (!result.data)
                            return;
                        await this.cacheManager.set(`${setting_enum_1.MAIL.BANNER_IMAGE}`, result.data.header, {
                            ttl: Number.MAX_SAFE_INTEGER,
                        });
                        await this.cacheManager.set(`${setting_enum_1.MAIL.FOOTER_IMAGE}`, result.data.footer, {
                            ttl: Number.MAX_SAFE_INTEGER,
                        });
                        bannerImage = result.data.header;
                        footerImage = result.data.footer;
                    }
                    await this.sendMailTpslStopOrder(user.email, order, trigger, exchangeLink, emailSupport, phoneSupport, bannerImage, footerImage);
                    userNotificationSettings.notificationQuantity += 1;
                    await this.userSettingMasterReport.save(userNotificationSettings);
                }
                catch (error) {
                    console.log('======= error send mail', error);
                    continue;
                }
            }
        }
    }
};
MailService.MAIL_DOMAIN = configs_1.getConfig().get('mail.domain');
MailService.MAIL_PREFIX = 'MAIL_CACHE_';
MailService.MAIL_TTL = 1800;
MailService.WAIT_PREFIX = 'MAIL_WAIT_';
MailService.WAIT_TTL = 60;
MailService = MailService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, bull_1.InjectQueue('mail')),
    tslib_1.__param(2, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(5, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'master')),
    tslib_1.__param(7, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [Object, nestjs_redis_1.RedisService, Object, axios_1.HttpService,
        user_setting_service_1.UserSettingeService,
        user_setting_repository_1.UserSettingRepository,
        translate_service_1.TranslateService,
        user_repository_1.UserRepository])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map