"use strict";
var FundingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment = require("moment");
const nestjs_redis_1 = require("nestjs-redis");
const funding_history_entity_1 = require("../../models/entities/funding-history.entity");
const funding_entity_1 = require("../../models/entities/funding.entity");
const funding_history_repository_1 = require("../../models/repositories/funding-history.repository");
const funding_repository_1 = require("../../models/repositories/funding.repository");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const market_indices_repository_1 = require("../../models/repositories/market-indices.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const user_setting_repository_1 = require("../../models/repositories/user-setting.repository");
const funding_const_1 = require("./funding.const");
const funding_dto_1 = require("./funding.dto");
const index_const_1 = require("../index/index.const");
const orderbook_const_1 = require("../orderbook/orderbook.const");
const orderbook_service_1 = require("../orderbook/orderbook.service");
const from_to_dto_1 = require("../../shares/dtos/from-to.dto");
const funding_enum_1 = require("../../shares/enums/funding.enum");
const order_enum_1 = require("../../shares/enums/order.enum");
const typeorm_2 = require("typeorm");
const leverage_margin_service_1 = require("../leverage-margin/leverage-margin.service");
const mail_service_1 = require("../mail/mail.service");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const notifications_service_1 = require("../matching-engine/notifications.service");
let FundingService = FundingService_1 = class FundingService {
    constructor(fundingRepositoryMaster, fundingRepositoryReport, instrumentRepositoryMaster, instrumentRepositoryReport, fundingHistoryRepositoryReport, marketIndexRepositoryMaster, marketIndicesRepositoryReport, positionRepoReport, userSettingRepoReport, cacheManager, redisService, connection, leverageMarginService, mailService, notificationService) {
        this.fundingRepositoryMaster = fundingRepositoryMaster;
        this.fundingRepositoryReport = fundingRepositoryReport;
        this.instrumentRepositoryMaster = instrumentRepositoryMaster;
        this.instrumentRepositoryReport = instrumentRepositoryReport;
        this.fundingHistoryRepositoryReport = fundingHistoryRepositoryReport;
        this.marketIndexRepositoryMaster = marketIndexRepositoryMaster;
        this.marketIndicesRepositoryReport = marketIndicesRepositoryReport;
        this.positionRepoReport = positionRepoReport;
        this.userSettingRepoReport = userSettingRepoReport;
        this.cacheManager = cacheManager;
        this.redisService = redisService;
        this.connection = connection;
        this.leverageMarginService = leverageMarginService;
        this.mailService = mailService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(FundingService_1.name);
    }
    fundingRateCaculation(impactBidPrice, impactAskPrice, indexPrice, interestRate, maintainMargin) {
        if (indexPrice == 0) {
            throw `Throw to avoid 0 in caculation ${__filename}`;
        }
        if (impactBidPrice == 0) {
            impactBidPrice = indexPrice;
        }
        if (impactAskPrice == 0) {
            impactAskPrice = indexPrice;
        }
        const premium = ((Math.max(0, impactBidPrice - indexPrice) - Math.max(0, indexPrice - impactAskPrice)) / indexPrice) * 100;
        console.log('premium', premium, impactBidPrice, impactAskPrice, indexPrice, interestRate, maintainMargin);
        const medianValues = [interestRate - premium, 0.05, -0.05];
        medianValues.sort(function (a, b) {
            return a - b;
        });
        const fundingRate = premium + medianValues[1];
        const capRate = 0.75 * maintainMargin;
        const floorRate = -0.75 * maintainMargin;
        const finalFundingRateValues = [fundingRate, capRate, floorRate];
        finalFundingRateValues.sort(function (a, b) {
            return a - b;
        });
        return finalFundingRateValues[1].toFixed(6);
    }
    caculatePriceImpact(asksOrBids, marginAmount, indexPrice) {
        let totalUsd = 0;
        let totalQuantity = 0;
        for (const element of asksOrBids) {
            if (marginAmount <= 0) {
                break;
            }
            const quantity = marginAmount < Number(element[0]) * Number(element[1]) ? Number(element[1]) : marginAmount / Number(element[0]);
            totalQuantity += quantity;
            totalUsd += Number(element[0]) * quantity;
            marginAmount -= Number(element[0]) * Number(element[1]);
        }
        if (totalUsd == 0)
            return indexPrice;
        else
            return totalUsd / totalQuantity;
    }
    caculateCoinMImpactPrice(asksOrBids, marginAmount, indexPrice) {
        let totalPrice = 0;
        let totalQuantity = 0;
        let totalAccumulatedValue = 0;
        let isDone = false;
        let lastPrice;
        for (const element of asksOrBids) {
            const notionalValue = Number(element[1]) / Number(element[0]);
            totalAccumulatedValue += notionalValue;
            totalPrice += Number(element[0]);
            totalQuantity += Number(element[1]);
            if (totalAccumulatedValue > marginAmount) {
                isDone = true;
                totalAccumulatedValue -= notionalValue;
                lastPrice = Number(element[0]);
                totalQuantity -= Number(element[1]);
                break;
            }
        }
        if (!isDone) {
            totalQuantity -= Number(asksOrBids[asksOrBids.length - 1][1]);
            lastPrice = Number(asksOrBids[asksOrBids.length - 1][0]);
            totalAccumulatedValue -=
                Number(asksOrBids[asksOrBids.length - 1][1]) / Number(asksOrBids[asksOrBids.length - 1][0]);
        }
        if (totalPrice == 0) {
            return indexPrice;
        }
        const impactPrice = ((marginAmount - totalAccumulatedValue) * lastPrice + totalQuantity) / marginAmount;
        return impactPrice;
    }
    async getImpactPrice(symbol, price) {
        const leverageMargins = await this.leverageMarginService.findAllByContract(order_enum_1.ContractType.USD_M);
        const listMaxLeverage = leverageMargins
            .map((lm) => {
            if (lm.symbol === symbol) {
                return +lm.maxLeverage;
            }
        })
            .filter((l) => l !== undefined);
        const result = leverageMargins.find((lm) => lm.symbol === symbol && +lm.maxLeverage === Math.max(...listMaxLeverage));
        if (!result) {
            return {
                impactBidPrice: price,
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: 0,
            };
        }
        const initMargin = 1 / result.maxLeverage;
        const marginAmount = 500 / initMargin;
        const orderbook = await this.cacheManager.get(`${orderbook_service_1.OrderbookService.getOrderbookKey(symbol)}`);
        if (orderbook == undefined || orderbook == null || (orderbook.bids.length == 0 && orderbook.asks.length == 0)) {
            return {
                impactBidPrice: price,
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
        else if (orderbook.bids.length > 0 && orderbook.asks.length == 0) {
            return {
                impactBidPrice: this.caculatePriceImpact(orderbook.bids, marginAmount, price),
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
        else if (orderbook.bids.length == 0 && orderbook.asks.length > 0) {
            return {
                impactBidPrice: this.caculatePriceImpact(orderbook.asks, marginAmount, price),
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
        else {
            return {
                impactBidPrice: this.caculatePriceImpact(orderbook.bids, marginAmount, price),
                impactAskPrice: this.caculatePriceImpact(orderbook.asks, marginAmount, price),
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
    }
    async getImpactPriceCoinM(symbol, price) {
        const leverageMargins = await this.leverageMarginService.findAllByContract(order_enum_1.ContractType.COIN_M);
        const listMaxLeverage = leverageMargins
            .map((lm) => {
            if (lm.symbol === symbol) {
                return +lm.maxLeverage;
            }
        })
            .filter((l) => l !== undefined);
        const result = leverageMargins.find((lm) => lm.symbol === symbol && +lm.maxLeverage === Math.max(...listMaxLeverage));
        const orderbook = await this.cacheManager.get(`${orderbook_service_1.OrderbookService.getOrderbookKey(symbol)}`);
        if (orderbook == undefined || orderbook == null || (orderbook.bids.length == 0 && orderbook.asks.length == 0)) {
            return {
                impactBidPrice: price,
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
        else if (orderbook.bids.length > 0 && orderbook.asks.length == 0) {
            return {
                impactBidPrice: this.caculateCoinMImpactPrice(orderbook.bids, funding_enum_1.IMN_COINM.VALUE, price),
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
        else if (orderbook.bids.length == 0 && orderbook.asks.length > 0) {
            return {
                impactBidPrice: this.caculatePriceImpact(orderbook.asks, funding_enum_1.IMN_COINM.VALUE, price),
                impactAskPrice: price,
                interestRate: 0.01,
                maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
            };
        }
        return {
            impactBidPrice: this.caculateCoinMImpactPrice(orderbook.bids, funding_enum_1.IMN_COINM.VALUE, price),
            impactAskPrice: this.caculateCoinMImpactPrice(orderbook.asks, funding_enum_1.IMN_COINM.VALUE, price),
            interestRate: 0.01,
            maintainMargin: result.maintenanceMarginRate == null ? null : Number(result.maintenanceMarginRate),
        };
    }
    async getMarketIndex() {
        const lastInserted = await this.redisService.getClient().get(`${index_const_1.INDEX_PRICE_PREFIX}last_inserted`);
        if (lastInserted)
            return JSON.parse(lastInserted);
        const query = 'SELECT `symbol`, `price` FROM `market_indices` AS m1 INNER JOIN (SELECT MAX(`id`) AS `latest` FROM `market_indices` GROUP BY `symbol`) AS m2 ON m1.id = m2.latest';
        const output = this.marketIndicesRepositoryReport.query(query);
        return output;
    }
    async getFundingRates(symbols) {
        if (!symbols.length) {
            return [];
        }
        const keys = symbols.map((symbol) => `${funding_const_1.FUNDING_PREFIX}${symbol}`);
        return await this.redisService.getClient().mget(keys);
    }
    async saveFundingRate(symbol, fundingRate) {
        const date = new Date();
        date.setMinutes(0, 0, 0);
        await Promise.all([
            this.cacheManager.set(`${funding_const_1.FUNDING_PREFIX}${symbol}`, +fundingRate, { ttl: funding_const_1.FUNDING_TTL }),
            this.cacheManager.set(`${funding_const_1.FUNDING_PREFIX}next_funding`, Date.now() + funding_const_1.NEXT_FUNDING),
        ]);
    }
    async getNextFunding(symbol) {
        const nextFundingCache = await this.redisService.getClient().get(`${funding_const_1.FUNDING_PREFIX}next_funding`);
        if (nextFundingCache) {
            return +nextFundingCache;
        }
        else {
            const nextFundingDb = await this.fundingRepositoryReport
                .createQueryBuilder('f')
                .select('f.nextFunding as nextFunding')
                .where('f.symbol = :symbol', { symbol })
                .andWhere('f.time >= :date', {
                date: new Date().toISOString().split('T')[0],
            })
                .orderBy('f.id', 'DESC')
                .getRawOne();
            if (nextFundingDb) {
                await this.redisService.getClient().set(`${funding_const_1.FUNDING_PREFIX}next_funding`, +nextFundingDb.nextFunding);
                return +nextFundingDb.nextFunding;
            }
        }
    }
    async fundingRate(symbol) {
        try {
            const fundingRateCache = await this.cacheManager.get(`${funding_const_1.FUNDING_PREFIX}${symbol}`);
            if (fundingRateCache) {
                return fundingRateCache;
            }
            else {
                const fundingRateDb = await this.fundingRepositoryReport
                    .createQueryBuilder('f')
                    .select('f.fundingRate as fundingRate')
                    .where('f.symbol = :symbol', { symbol })
                    .andWhere('f.time >= :date', {
                    date: new Date().toISOString().split('T')[0],
                })
                    .orderBy('f.id', 'DESC')
                    .getRawOne();
                if (fundingRateDb === null || fundingRateDb === void 0 ? void 0 : fundingRateDb.fundingRate) {
                    this.cacheManager.set(`${funding_const_1.FUNDING_PREFIX}${symbol}`, +fundingRateDb.fundingRate, { ttl: funding_const_1.FUNDING_TTL });
                    return fundingRateDb.fundingRate;
                }
            }
        }
        catch (e) {
            console.log('===============errr==============');
            console.log(e);
        }
    }
    async setLastPay() {
        await this.redisService.getClient().set(`${funding_const_1.FUNDING_PREFIX}last_pay`, Date.now());
    }
    async setLastUpdate() {
        await this.redisService.getClient().set(`${funding_const_1.FUNDING_PREFIX}last_update`, Date.now());
    }
    async getLastPay() {
        const value = await this.redisService.getClient().get(`${funding_const_1.FUNDING_PREFIX}last_pay`);
        return value ? Number(value) : 0;
    }
    async getLastUpdate() {
        const value = await this.redisService.getClient().get(`${funding_const_1.FUNDING_PREFIX}last_update`);
        return value ? Number(value) : 0;
    }
    async getFundingHistoryByAccountId(symbol) {
        const startDate = moment().subtract(13, 'days').format('YYYY-MM-DD 00:00:00');
        const endDate = moment().format('YYYY-MM-DD 23:59:59');
        return await this.fundingRepositoryReport
            .createQueryBuilder('f')
            .select([
            'f.id as id',
            'f.time as time',
            'f.fundingRate as fundingRate',
            'f.fundingInterval as fundingInterval',
            'f.symbol as symbol',
        ])
            .where('f.symbol = :symbol', { symbol })
            .andWhere('f.createdAt BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orderBy('f.createdAt', 'DESC')
            .getRawMany();
    }
    async getFundingRatesFromTo(symbol, { from, to }) {
        const fundingRates = await this.fundingRepositoryReport.find({
            select: ['id', 'symbol', 'fundingRate', 'createdAt'],
            where: {
                symbol: symbol,
                time: typeorm_2.Between(new Date(from), new Date(to)),
            },
            order: {
                time: 'ASC',
            },
        });
        return fundingRates;
    }
    async findHistoryBefore(date) {
        return await this.fundingHistoryRepositoryReport.findHistoryBefore(date);
    }
    async findHistoryBatch(fromId, count) {
        return await this.fundingHistoryRepositoryReport.findBatch(fromId, count);
    }
    async sendMailFundingFee(dataFundingRates) {
        const userSettings = await this.userSettingRepoReport.getUserSettingToSendFundingFeeMail();
        for (const userSetting of userSettings) {
            const symbols = [];
            for (const dataFundingRate of dataFundingRates) {
                const position = await this.positionRepoReport.findPositionByUserId(userSetting.userId, dataFundingRate.symbol);
                if (!position) {
                    continue;
                }
                if (Number(position.currentQty) > 0 &&
                    Number(dataFundingRate.fundingRate) > Number(userSetting.fundingFeeTriggerValue)) {
                    symbols.push({ symbol: position.symbol, fundingRate: Number(dataFundingRate.fundingRate) });
                }
                if (Number(position.currentQty) < 0 &&
                    Number(dataFundingRate.fundingRate) < -Number(userSetting.fundingFeeTriggerValue)) {
                    symbols.push({ symbol: position.symbol, fundingRate: Number(dataFundingRate.fundingRate) });
                }
            }
            if (symbols.length > 0 && userSetting.fundingFeeTrigger) {
                this.mailService.sendMailFundingFee(userSetting.email, userSetting.fundingFeeTriggerValue, symbols);
                this.notificationService.genDataNotificationFirebase(matching_engine_const_1.NOTIFICATION_TYPE.FUNDING_FEE, userSetting.userId);
            }
        }
    }
};
FundingService = FundingService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(funding_repository_1.FundingRepository, 'master')),
    tslib_1.__param(1, typeorm_1.InjectRepository(funding_repository_1.FundingRepository, 'report')),
    tslib_1.__param(2, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(funding_history_repository_1.FundingHistoryRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(market_indices_repository_1.MarketIndexRepository, 'master')),
    tslib_1.__param(6, typeorm_1.InjectRepository(market_indices_repository_1.MarketIndexRepository, 'report')),
    tslib_1.__param(7, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(8, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'report')),
    tslib_1.__param(9, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(11, typeorm_1.InjectConnection('master')),
    tslib_1.__metadata("design:paramtypes", [funding_repository_1.FundingRepository,
        funding_repository_1.FundingRepository,
        instrument_repository_1.InstrumentRepository,
        instrument_repository_1.InstrumentRepository,
        funding_history_repository_1.FundingHistoryRepository,
        market_indices_repository_1.MarketIndexRepository,
        market_indices_repository_1.MarketIndexRepository,
        position_repository_1.PositionRepository,
        user_setting_repository_1.UserSettingRepository, Object, nestjs_redis_1.RedisService,
        typeorm_2.Connection,
        leverage_margin_service_1.LeverageMarginService,
        mail_service_1.MailService,
        notifications_service_1.NotificationService])
], FundingService);
exports.FundingService = FundingService;
//# sourceMappingURL=funding.service.js.map