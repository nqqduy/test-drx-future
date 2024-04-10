"use strict";
var FundingConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingConsole = void 0;
const tslib_1 = require("tslib");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_console_1 = require("nestjs-console");
const nestjs_redis_1 = require("nestjs-redis");
const funding_repository_1 = require("../../models/repositories/funding.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const user_setting_repository_1 = require("../../models/repositories/user-setting.repository");
const user_repository_1 = require("../../models/repositories/user.repository");
const funding_service_1 = require("./funding.service");
const index_const_1 = require("../index/index.const");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const funding_enum_1 = require("../../shares/enums/funding.enum");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const instrument_service_1 = require("../instrument/instrument.service");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../matching-engine/notifications.service");
const orderbook_service_1 = require("../orderbook/orderbook.service");
const transaction_const_1 = require("../transaction/transaction.const");
const funding_const_1 = require("./funding.const");
let FundingConsole = FundingConsole_1 = class FundingConsole {
    constructor(fundingService, mailService, fundingRepositoryMaster, fundingRepositoryReport, kafkaClient, cacheManager, redisService, userSettingRepoReport, userSettingMasterReport, userRepoReport, userMasterReport, positionRepoReport, instrumentService, notificationService, emailQueue) {
        this.fundingService = fundingService;
        this.mailService = mailService;
        this.fundingRepositoryMaster = fundingRepositoryMaster;
        this.fundingRepositoryReport = fundingRepositoryReport;
        this.kafkaClient = kafkaClient;
        this.cacheManager = cacheManager;
        this.redisService = redisService;
        this.userSettingRepoReport = userSettingRepoReport;
        this.userSettingMasterReport = userSettingMasterReport;
        this.userRepoReport = userRepoReport;
        this.userMasterReport = userMasterReport;
        this.positionRepoReport = positionRepoReport;
        this.instrumentService = instrumentService;
        this.notificationService = notificationService;
        this.emailQueue = emailQueue;
        this.logger = new common_1.Logger(FundingConsole_1.name);
    }
    async calculateFundingRate() {
        const getCache = await this.cacheManager.get(funding_const_1.START_FUNDING_RATE);
        if (getCache) {
            return;
        }
        const marketIndices = await this.fundingService.getMarketIndex();
        const dataFundingRates = [];
        const listSymbol = await this.instrumentService.getAllSymbolInstrument();
        const nextFunding = Date.now() + funding_const_1.NEXT_FUNDING;
        for (const rowIndex in marketIndices) {
            const symbol = marketIndices[rowIndex].symbol;
            const isExistInstrument = listSymbol.includes(symbol);
            if (!isExistInstrument) {
                continue;
            }
            const orderbook = await this.cacheManager.get(`${orderbook_service_1.OrderbookService.getOrderbookKey(symbol)}`);
            let fundingRate = funding_enum_1.FUNDING_RATE.DEFAULT;
            if (orderbook && orderbook.bids.length && orderbook.asks.length) {
                const isCoim = transaction_const_1.LIST_SYMBOL_COINM.includes(symbol);
                let impact;
                if (isCoim) {
                    impact = await this.fundingService.getImpactPriceCoinM(symbol, marketIndices[rowIndex].price);
                }
                else {
                    impact = await this.fundingService.getImpactPrice(symbol, marketIndices[rowIndex].price);
                }
                fundingRate = this.fundingService.fundingRateCaculation(impact.impactBidPrice, impact.impactAskPrice, marketIndices[rowIndex].price, impact.interestRate, impact.maintainMargin == null ? 1 : impact.maintainMargin);
            }
            const now = Date.now();
            const time = new Date(now - (now % funding_enum_1.FUNDING_RATE.NEXT_TIME));
            const oraclePrice = (await this.redisService.getClient().get(`${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`)) || '0';
            await this.saveFundingToDB(symbol, fundingRate, time, oraclePrice, nextFunding);
            await this.fundingService.saveFundingRate(symbol, fundingRate);
            dataFundingRates.push({ symbol, fundingRate });
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.PAY_FUNDING,
                data: { symbol, fundingRate: fundingRate, oraclePrice: oraclePrice, time: time.getTime() },
            });
        }
        if (dataFundingRates.length > 0) {
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.send_mail, {
                code: matching_engine_const_1.CommandCode.MAIL_FUNDING,
                data: dataFundingRates,
            });
        }
        await this.fundingService.setLastUpdate();
        await this.cacheManager.set(funding_const_1.START_FUNDING_RATE, true, { ttl: funding_const_1.START_FUNDING_RATE_TTL });
        await this.cacheManager.set(funding_const_1.KEY_CACHE_HEALTHCHECK_GET_FUNDING, true, {
            ttl: funding_const_1.KEY_CACHE_HEALTHCHECK_GET_FUNDING_TTL,
        });
    }
    async saveFundingToDB(symbol, fundingRate, time, oraclePrice, nextFunding) {
        const fundingInterval = matching_engine_const_1.FUNDING_INTERVAL;
        await this.fundingRepositoryMaster.save({
            symbol,
            time,
            fundingRate,
            fundingInterval,
            oraclePrice,
            nextFunding,
        });
    }
    async payFundingForContract(symbol, timestamp) {
        let time;
        if (timestamp) {
            time = new Date(timestamp - (timestamp % funding_enum_1.FUNDING_RATE.NEXT_TIME));
        }
        else {
            const now = Date.now();
            time = new Date(now - (now % funding_enum_1.FUNDING_RATE.NEXT_TIME));
        }
        const fundingRate = await this.getFundingRate(symbol);
        const positionHistoryTimestamp = await this.getPositionHistoryTimestamp();
        if (!positionHistoryTimestamp || time.getTime() < positionHistoryTimestamp) {
            this.logger.error(`Cannot pay funding before (position history) ${new Date(positionHistoryTimestamp || 0)}`);
            return;
        }
        const fundingHistoryTimestamp = await this.getFundingHistoryTimestamp();
        if (!fundingHistoryTimestamp || time.getTime() < fundingHistoryTimestamp) {
            this.logger.error(`Cannot pay funding before (funding history) ${new Date(fundingHistoryTimestamp || 0)}`);
            return;
        }
        if (!fundingRate) {
            this.logger.error(`Cannot find funding rate for symbol ${symbol} at ${time}`);
            return;
        }
        const oraclePrice = await this.redisService.getClient().get(`${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`);
        if (!oraclePrice) {
            this.logger.error(`Cannot get oracle price of symbol ${symbol}`);
            return;
        }
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.PAY_FUNDING,
            data: { symbol, fundingRate: fundingRate, oraclePrice: oraclePrice, time: time.getTime() },
        });
    }
    async getPositionHistoryTimestamp() {
        return this.cacheManager.get(matching_engine_const_1.POSITION_HISTORY_TIMESTAMP_KEY);
    }
    async getFundingHistoryTimestamp() {
        return this.cacheManager.get(matching_engine_const_1.FUNDING_HISTORY_TIMESTAMP_KEY);
    }
    async getFundingRate(symbol) {
        return await this.fundingService.fundingRate(symbol);
    }
    async updateFundingRate(symbol, time, indexPrice) {
        let impact;
        const isCoim = transaction_const_1.LIST_SYMBOL_COINM.includes(symbol);
        if (isCoim) {
            impact = await this.fundingService.getImpactPriceCoinM(symbol, indexPrice);
        }
        else {
            impact = await this.fundingService.getImpactPrice(symbol, indexPrice);
        }
        const funding = await this.getFundingRate(symbol);
        if (funding) {
            this.logger.log(`Funding rate of symbol ${symbol} at ${time} is already calculated`);
            return;
        }
        this.logger.log(`Calculate funding rate of symbol ${symbol} at ${time} and `);
        const fundingRate = this.fundingService.fundingRateCaculation(impact.impactBidPrice, impact.impactAskPrice, indexPrice, impact.interestRate, impact.maintainMargin == null ? 1 : impact.maintainMargin);
        const oraclePrice = await this.redisService.getClient().get(`${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`);
        if (!oraclePrice) {
            this.logger.error(`Cannot get oracle price of symbol ${symbol}`);
            return;
        }
        const fundingInterval = matching_engine_const_1.FUNDING_INTERVAL;
        await this.fundingRepositoryMaster.save({
            symbol: symbol,
            time: time,
            fundingRate: fundingRate,
            fundingInterval: fundingInterval,
            oraclePrice,
        });
    }
    async closeInsurance() {
        const checkCloseInsurance = await this.cacheManager.get(funding_const_1.CLOSE_INSURANCE);
        if (checkCloseInsurance) {
            return;
        }
        console.log('Start the job to get close insurance');
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.CLOSE_INSURANCE,
        });
        await this.cacheManager.set(funding_const_1.CLOSE_INSURANCE, true, { ttl: funding_const_1.CLOSE_INSURANCE_TTL });
    }
    async sendMail(groupId, callback) {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.send_mail, groupId, async (command) => {
            await callback(command);
        }, { fromBeginning: true });
        return new Promise(() => { });
    }
    async sendMailFundingFee() {
        await this.sendMail(kafka_enum_1.KafkaGroups.send_mail, (command) => this.fundingService.sendMailFundingFee(command.data));
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'start-get-funding-rate',
        description: 'Start the job to get funding rate',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FundingConsole.prototype, "calculateFundingRate", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'close-insurance',
        description: 'Start the job to get close insurance',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FundingConsole.prototype, "closeInsurance", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'funding:send-mail-funding-fee',
        description: 'send mail funding fee',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FundingConsole.prototype, "sendMailFundingFee", null);
FundingConsole = FundingConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(2, typeorm_1.InjectRepository(funding_repository_1.FundingRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(funding_repository_1.FundingRepository, 'report')),
    tslib_1.__param(5, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(7, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'report')),
    tslib_1.__param(8, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'master')),
    tslib_1.__param(9, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__param(10, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'master')),
    tslib_1.__param(11, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(14, bull_1.InjectQueue('mail')),
    tslib_1.__metadata("design:paramtypes", [funding_service_1.FundingService,
        mail_service_1.MailService,
        funding_repository_1.FundingRepository,
        funding_repository_1.FundingRepository,
        kafka_client_1.KafkaClient, Object, nestjs_redis_1.RedisService,
        user_setting_repository_1.UserSettingRepository,
        user_setting_repository_1.UserSettingRepository,
        user_repository_1.UserRepository,
        user_repository_1.UserRepository,
        position_repository_1.PositionRepository,
        instrument_service_1.InstrumentService,
        notifications_service_1.NotificationService, Object])
], FundingConsole);
exports.FundingConsole = FundingConsole;
//# sourceMappingURL=funding.console.js.map