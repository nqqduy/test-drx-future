"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const kafka_1 = require("../../configs/kafka");
const funding_service_1 = require("../funding/funding.service");
const index_service_1 = require("../index/index.service");
const ticker_const_1 = require("./ticker.const");
const ticker_service_1 = require("./ticker.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const socket_emitter_1 = require("../../shares/helpers/socket-emitter");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const index_const_1 = require("../index/index.const");
const transaction_const_1 = require("../transaction/transaction.const");
const order_enum_1 = require("../../shares/enums/order.enum");
let TickerConsole = class TickerConsole {
    constructor(tickerService, cacheManager, kafkaClient, fundingService, indexService) {
        this.tickerService = tickerService;
        this.cacheManager = cacheManager;
        this.kafkaClient = kafkaClient;
        this.fundingService = fundingService;
        this.indexService = indexService;
    }
    async load() {
        await this.kafkaClient.delete([kafka_enum_1.KafkaTopics.ticker_engine_preload]);
        const producer = kafka_1.kafka.producer();
        await producer.connect();
        await this.tickerService.loadInstruments(producer);
        await this.tickerService.loadTrades(producer);
        await this.tickerService.startEngine(producer);
        await producer.disconnect();
    }
    async publish() {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.ticker_engine_output, kafka_enum_1.KafkaGroups.ticker, async (tickers) => {
            console.log(tickers);
            console.log('============================================');
            await this.addExtraInfoToTickers(tickers);
            socket_emitter_1.SocketEmitter.getInstance().emitTickers(tickers);
            await this.cacheManager.set(ticker_const_1.TICKERS_KEY, tickers, { ttl: ticker_const_1.TICKER_TTL });
        });
        return new Promise(() => { });
    }
    async addExtraInfoToTickers(tickers) {
        const symbols = tickers.map((ticker) => ticker.symbol);
        const [indexPrices, oraclePrices, fundingRates, nextFunding, oldTickers] = await Promise.all([
            this.indexService.getIndexPrices(symbols),
            this.indexService.getOraclePrices(symbols),
            this.fundingService.getFundingRates(symbols),
            this.fundingService.getNextFunding(symbols[0]),
            this.cacheManager.get(ticker_const_1.TICKERS_KEY),
        ]);
        for (let i = 0; i < tickers.length; i++) {
            const ticker = tickers[i];
            const cacheLastPrice = await this.cacheManager.get(`${index_const_1.LAST_PRICE_PREFIX}${ticker.symbol}`);
            const newTicker = (oldTickers === null || oldTickers === void 0 ? void 0 : oldTickers.find((item) => item.symbol == ticker.symbol)) || ticker;
            const isCoinM = transaction_const_1.LIST_SYMBOL_COINM.includes(ticker.symbol);
            const contractType = isCoinM ? order_enum_1.ContractType.COIN_M : order_enum_1.ContractType.USD_M;
            if (cacheLastPrice) {
                ticker.priceChange = newTicker.priceChange;
                ticker.priceChangePercent = newTicker.priceChangePercent;
                ticker.lastPriceChange = cacheLastPrice ? `${+ticker.lastPrice - +cacheLastPrice}` : ticker.lastPriceChange;
                ticker.lastPrice = newTicker.lastPrice;
                ticker.highPrice = newTicker.highPrice;
                ticker.lowPrice = newTicker.lowPrice;
                ticker.volume = newTicker.volume;
                ticker.quoteVolume = newTicker.quoteVolume;
                await this.cacheManager.del(`${index_const_1.LAST_PRICE_PREFIX}${ticker.symbol}`);
            }
            ticker.indexPrice = indexPrices[i];
            ticker.oraclePrice = oraclePrices[i];
            ticker.fundingRate = fundingRates[i];
            ticker.nextFunding = +nextFunding;
            ticker.contractType = contractType;
        }
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'ticker:load',
        description: 'Load data into ticker engine',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TickerConsole.prototype, "load", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'ticker:publish',
        description: 'Publish ticker',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TickerConsole.prototype, "publish", null);
TickerConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(1, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [ticker_service_1.TickerService, Object, kafka_client_1.KafkaClient,
        funding_service_1.FundingService,
        index_service_1.IndexService])
], TickerConsole);
exports.TickerConsole = TickerConsole;
//# sourceMappingURL=ticker.console.js.map