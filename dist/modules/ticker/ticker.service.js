"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const instrument_service_1 = require("../instrument/instrument.service");
const base_engine_service_1 = require("../matching-engine/base-engine.service");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const ticker_const_1 = require("./ticker.const");
const trade_service_1 = require("../trade/trade.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const funding_service_1 = require("../funding/funding.service");
const index_const_1 = require("../index/index.const");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const typeorm_1 = require("@nestjs/typeorm");
let TickerService = class TickerService extends base_engine_service_1.BaseEngineService {
    constructor(cacheManager, instrumentService, tradeService, instrumentRepoReport, fundingService) {
        super();
        this.cacheManager = cacheManager;
        this.instrumentService = instrumentService;
        this.tradeService = tradeService;
        this.instrumentRepoReport = instrumentRepoReport;
        this.fundingService = fundingService;
    }
    async getTickers(contractType, symbol) {
        const [tickers, nextFunding] = await Promise.all([
            this.cacheManager.get(ticker_const_1.TICKERS_KEY),
            this.fundingService.getNextFunding(symbol),
        ]);
        const instrumentSymbol = await this.instrumentService.getAllTickerInstrument();
        tickers.forEach((ticker) => {
            var _a;
            ticker.contractType = (_a = instrumentSymbol === null || instrumentSymbol === void 0 ? void 0 : instrumentSymbol.find((symbol) => symbol.symbol == ticker.symbol)) === null || _a === void 0 ? void 0 : _a.contractType;
            ticker.nextFunding = +nextFunding;
        });
        const existingTickers = tickers || [];
        const existingTickerSymbols = new Set(existingTickers.map((item) => item.symbol));
        const newTickers = instrumentSymbol
            .filter((item) => !existingTickerSymbols.has(item.symbol))
            .map((item) => ({
            symbol: item.symbol,
            priceChange: '0',
            priceChangePercent: '0',
            lastPrice: '',
            lastPriceChange: null,
            highPrice: '',
            lowPrice: '',
            volume: '',
            quoteVolume: '',
            indexPrice: '',
            oraclePrice: '',
            fundingRate: '',
            nextFunding: +nextFunding,
            contractType: item.contractType,
            name: item.name,
        }));
        let updatedTickers = existingTickers.concat(newTickers);
        await Promise.all(updatedTickers.map(async (item) => {
            const [lastPrice, indexPrice, oraclePrice, fundingRate] = await Promise.all([
                this.cacheManager.get(`${index_const_1.LAST_PRICE_PREFIX}${item.symbol}`),
                this.cacheManager.get(`${index_const_1.INDEX_PRICE_PREFIX}${item.symbol}`),
                this.cacheManager.get(`${index_const_1.ORACLE_PRICE_PREFIX}${item.symbol}`),
                this.fundingService.fundingRate(item.symbol),
            ]);
            item.lastPrice = lastPrice ? lastPrice : item.lastPrice;
            item.indexPrice = indexPrice || '';
            item.oraclePrice = oraclePrice || '';
            item.fundingRate = fundingRate || '';
        }));
        if (contractType) {
            updatedTickers = updatedTickers.filter((item) => {
                return item.contractType == contractType;
            });
        }
        if (symbol) {
            updatedTickers = updatedTickers.filter((item) => {
                return item.symbol == symbol;
            });
        }
        return updatedTickers;
    }
    async loadInstruments(producer) {
        const instruments = await this.instrumentService.find();
        const data = instruments.map((instrument) => {
            return { data: instrument, code: matching_engine_const_1.CommandCode.UPDATE_INSTRUMENT };
        });
        await producer.send({
            topic: kafka_enum_1.KafkaTopics.ticker_engine_preload,
            messages: [{ value: JSON.stringify(data) }],
        });
    }
    async loadTrades(producer) {
        const yesterday = new Date(Date.now() - 86400000);
        let trades = [];
        let index = 0;
        const instruments = await this.instrumentRepoReport.find({ select: ['symbol'] });
        let symbolsNotHaveTrade = instruments.map((e) => e.symbol);
        console.log('before: ', symbolsNotHaveTrade.length);
        do {
            trades = await this.tradeService.findTodayTrades(yesterday, index, matching_engine_const_1.BATCH_SIZE);
            const tradeSymbol = [...new Set(trades.map((trade) => trade.symbol))];
            symbolsNotHaveTrade = symbolsNotHaveTrade.filter((trade) => !tradeSymbol.includes(trade));
            index += trades.length;
            const command = { code: matching_engine_const_1.CommandCode.PLACE_ORDER, trades };
            await producer.send({
                topic: kafka_enum_1.KafkaTopics.ticker_engine_preload,
                messages: [{ value: class_transformer_1.serialize([command]) }],
            });
        } while (trades.length > 0);
        console.log('after: ', symbolsNotHaveTrade.length);
        console.log({ symbolsNotHaveTrade });
        for (const symbol of symbolsNotHaveTrade) {
            const lastTrade = await this.tradeService.getLastTrade(symbol);
            console.log({ lastTrade });
            if (lastTrade) {
                const command = { code: matching_engine_const_1.CommandCode.PLACE_ORDER, trades: lastTrade ? lastTrade : null };
                await producer.send({
                    topic: kafka_enum_1.KafkaTopics.ticker_engine_preload,
                    messages: [{ value: class_transformer_1.serialize([command]) }],
                });
            }
        }
    }
    async startEngine(producer) {
        const command = { code: matching_engine_const_1.CommandCode.START_ENGINE };
        await producer.send({ topic: kafka_enum_1.KafkaTopics.ticker_engine_preload, messages: [{ value: JSON.stringify([command]) }] });
    }
    async loadYesterdayTrades(producer, date) {
        const instruments = await this.instrumentService.getAllInstruments();
        const yesterdayTrades = [];
        for (const instrument of instruments) {
            const trade = await this.tradeService.findYesterdayTrade(date, instrument.symbol);
            if (trade) {
                yesterdayTrades.push(trade);
            }
        }
        if (yesterdayTrades.length > 0) {
            const command = { code: matching_engine_const_1.CommandCode.PLACE_ORDER, trades: yesterdayTrades };
            await producer.send({
                topic: kafka_enum_1.KafkaTopics.ticker_engine_preload,
                messages: [{ value: class_transformer_1.serialize([command]) }],
            });
        }
    }
};
TickerService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(3, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [Object, instrument_service_1.InstrumentService,
        trade_service_1.TradeService,
        instrument_repository_1.InstrumentRepository,
        funding_service_1.FundingService])
], TickerService);
exports.TickerService = TickerService;
//# sourceMappingURL=ticker.service.js.map