"use strict";
var IndexService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bignumber_js_1 = require("bignumber.js");
const nestjs_console_1 = require("nestjs-console");
const nestjs_redis_1 = require("nestjs-redis");
const instrument_entity_1 = require("../../models/entities/instrument.entity");
const metadata_entity_1 = require("../../models/entities/metadata.entity");
const market_data_repository_1 = require("../../models/repositories/market-data.repository");
const market_indices_repository_1 = require("../../models/repositories/market-indices.repository");
const metadata_repository_1 = require("../../models/repositories/metadata.repository");
const funding_service_1 = require("../funding/funding.service");
const index_dto_1 = require("./dto/index.dto");
const CONST = require("./index.const");
const index_const_1 = require("./index.const");
const base_1 = require("./markets/base");
const base_binance_1 = require("./markets/base.binance");
const base_okx_1 = require("./markets/base.okx");
const instrument_service_1 = require("../instrument/instrument.service");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const orderbook_const_1 = require("../orderbook/orderbook.const");
const orderbook_service_1 = require("../orderbook/orderbook.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const utils_1 = require("../../shares/helpers/utils");
const https_client_1 = require("../../shares/http-clients/https.client");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const typeorm_2 = require("typeorm");
const funding_const_1 = require("../funding/funding.const");
const ticker_const_1 = require("../ticker/ticker.const");
const transaction_const_1 = require("../transaction/transaction.const");
const base_huobi_1 = require("./markets/base.huobi");
let IndexService = IndexService_1 = class IndexService {
    constructor(marketDataRepositoryMaster, marketDataRepositoryReport, marketIndexRepositoryMaster, marketIndexRepositoryReport, metaRepositoryMaster, metaRepositoryReport, cacheService, redisService, connection, httpClient, kafkaClient, instrumentService, orderbookService, fundingService, cacheManager) {
        this.marketDataRepositoryMaster = marketDataRepositoryMaster;
        this.marketDataRepositoryReport = marketDataRepositoryReport;
        this.marketIndexRepositoryMaster = marketIndexRepositoryMaster;
        this.marketIndexRepositoryReport = marketIndexRepositoryReport;
        this.metaRepositoryMaster = metaRepositoryMaster;
        this.metaRepositoryReport = metaRepositoryReport;
        this.cacheService = cacheService;
        this.redisService = redisService;
        this.connection = connection;
        this.httpClient = httpClient;
        this.kafkaClient = kafkaClient;
        this.instrumentService = instrumentService;
        this.orderbookService = orderbookService;
        this.fundingService = fundingService;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(IndexService_1.name);
        this.instrumentMap = {};
    }
    async syncMarketData() {
        await this.loadMeta();
        await this.loadInstruments();
        while (true) {
            this.getCurrentFuturePrice();
            this.updateIndexPrice();
            await this.cacheManager.set(funding_const_1.KEY_CACHE_HEALTHCHECK_GET_FUNDING, true, { ttl: 10 });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    getBase(market) {
        let base;
        switch (String(market).toLowerCase().trim()) {
            case 'binance':
                base = new base_binance_1.Binance();
                break;
            case 'huobi':
                base = new base_huobi_1.Huobi();
                break;
            case 'okx':
                base = new base_okx_1.OKX();
                break;
            default:
                break;
        }
        return base;
    }
    async getCurrentFuturePrice() {
        for (const market in this.metaMarket) {
            const base = this.getBase(market);
            try {
                const requestUrls = base.createRequestStringForMarket(this.metaMarket[market]);
                const taskRequest = [];
                for (const index in requestUrls) {
                    taskRequest.push(this.requestIndexPrice(base, market, Number(index), requestUrls[index]));
                }
                await Promise.all([...taskRequest]);
            }
            catch (error) { }
        }
    }
    async requestIndexPrice(base, market, index, requestUrl) {
        try {
            const timeCanRequest = await this.redisService.getClient().get(`${CONST.NEXT_TIME_MARKET}${market}`);
            const currentTime = new Date().getTime();
            if (timeCanRequest && market !== 'binance' && currentTime <= Number(timeCanRequest)) {
                return;
            }
            const resp = await this.httpClient.client.get(requestUrl);
            const nextTime = new Date().getTime() + 2000;
            await this.redisService.getClient().set(`${CONST.NEXT_TIME_MARKET}${market}`, nextTime, 'EX', 5);
            const marketPrice = await base.transformResponseMaketIndex(resp);
            marketPrice.group = this.metaMarket[market].pairs[index].group;
            marketPrice.symbol = this.metaMarket[market].pairs[index].symbol;
            await Promise.all([
                this.marketDataRepositoryMaster.save({
                    market: marketPrice.market,
                    symbol: marketPrice.symbol,
                    group: marketPrice.group,
                    bid: String(marketPrice.bid),
                    ask: String(marketPrice.ask),
                    index: String(marketPrice.index),
                }),
                this.marketDataRepositoryMaster.save({
                    market: marketPrice.market,
                    symbol: marketPrice.symbol.slice(0, -1),
                    group: marketPrice.group.slice(0, -1),
                    bid: String(utils_1.getRandomDeviateNumber(Number(marketPrice.bid), CONST.deviatePercentUSDTUSD[0], CONST.deviatePercentUSDTUSD[1])),
                    ask: String(utils_1.getRandomDeviateNumber(Number(marketPrice.ask), CONST.deviatePercentUSDTUSD[0], CONST.deviatePercentUSDTUSD[1])),
                    index: String(utils_1.getRandomDeviateNumber(Number(marketPrice.index), CONST.deviatePercentUSDTUSD[0], CONST.deviatePercentUSDTUSD[1])),
                }),
            ]);
        }
        catch (err) {
            console.log(err);
            await this.redisService.getClient().set(`${index_const_1.INDEX_PRICE_PREFIX}error`, 'true', 'EX', 120);
        }
    }
    async updateIndexPrice() {
        const timeframe = process.env.TEST_INDEX_TIMEFRAME == undefined
            ? CONST.MetaCommon.timeframe
            : Number(process.env.TEST_INDEX_TIMEFRAME);
        const rows = await this.marketDataRepositoryReport.query('select mdr.group, mdr.market, mdr.bid AS `index`, mdr.createdAt as createtime ' +
            'from market_data mdr ' +
            'inner join( select `group`, `market`, max(id) as latest from market_data group by `group`, `market`) t ' +
            'on mdr.group = t.group and mdr.market = t.market and mdr.id = t.latest ' +
            `where mdr.createdAt > '${new Date(Date.now() - timeframe * 1000).toISOString()}' ` +
            'order by mdr.group, mdr.index');
        const groups = {};
        for (const indexRow in rows) {
            const group = String(rows[indexRow].group).trim();
            if (!(group in groups)) {
                groups[group] = { market: [], index: [], weight: [], length: 0 };
            }
            groups[group].market.push(rows[indexRow].market);
            groups[group].index.push(rows[indexRow].index);
            groups[group].weight.push(this.metaWeight[group][rows[indexRow].market]);
            groups[group].length += 1;
        }
        const lastIndexInserted = [];
        let updatedIndex = 0;
        for (const group in groups) {
            const coinGroup = groups[group];
            let median;
            if (coinGroup.length % 2 === 0) {
                const firstPrice = coinGroup.index[Math.floor(coinGroup.length / 2)];
                const secondPrice = coinGroup.index[Math.floor(coinGroup.length / 2) - 1];
                median = new bignumber_js_1.default(firstPrice).plus(secondPrice).div(2).toNumber();
            }
            else {
                median = coinGroup.index[Math.floor(coinGroup.length / 2)];
            }
            let totalWeight = 0;
            let totalWeightedPrice = 0;
            let totalExchangeOutOfBound = 0;
            for (let i = 0; i < coinGroup.length; i++) {
                const currentIndexPrice = coinGroup.index[i];
                const diviationRatio = currentIndexPrice / median;
                if (diviationRatio <= 1.05 && diviationRatio >= 0.95) {
                    totalWeightedPrice += coinGroup.weight[i] * currentIndexPrice;
                    totalWeight += coinGroup.weight[i];
                }
                else {
                    totalExchangeOutOfBound += 1;
                    if (totalExchangeOutOfBound > 1)
                        break;
                    continue;
                }
            }
            let priceWithoutPrecision;
            if (totalExchangeOutOfBound === 0 || totalExchangeOutOfBound === 1) {
                priceWithoutPrecision = totalWeightedPrice / totalWeight;
            }
            else {
                priceWithoutPrecision = median;
            }
            console.log("++++++++++++++++++++++++++");
            console.log("priceWithoutPrecision ", priceWithoutPrecision);
            console.log("median ", median);
            console.log("symbol ", group);
            const instrument = this.instrumentMap[group];
            const tickSize = parseFloat(instrument === null || instrument === void 0 ? void 0 : instrument.tickSize) ? parseFloat(instrument === null || instrument === void 0 ? void 0 : instrument.tickSize) : index_const_1.TICK_SIZE_DEFAULT;
            const precision = -Math.ceil(Math.log10(tickSize));
            const price = priceWithoutPrecision.toFixed(precision);
            const insertedEntity = await this.marketIndexRepositoryMaster.save({
                symbol: group,
                price,
            });
            const symbolCoinM = group.replace('USDT', 'USDM');
            const isCoinM = transaction_const_1.LIST_SYMBOL_COINM.includes(symbolCoinM);
            if (isCoinM) {
                const insertedEntityCoinM = await this.marketIndexRepositoryMaster.save({
                    symbol: symbolCoinM,
                    price,
                });
                lastIndexInserted.push(insertedEntityCoinM);
            }
            await this.calculateOraclePrice(group, priceWithoutPrecision, price);
            lastIndexInserted.push(insertedEntity);
            updatedIndex++;
        }
        await this.redisService.getClient().set(`${index_const_1.INDEX_PRICE_PREFIX}last_inserted`, JSON.stringify(lastIndexInserted));
        await this.redisService.getClient().set(`${index_const_1.INDEX_PRICE_PREFIX}update_count`, updatedIndex);
        await this.redisService.getClient().set(`${index_const_1.INDEX_PRICE_PREFIX}last_update`, Date.now());
    }
    async getIndexPrices(symbols) {
        if (!symbols.length) {
            return [];
        }
        const keys = symbols.map((symbol) => `${index_const_1.INDEX_PRICE_PREFIX}${symbol}`);
        return await this.redisService.getClient().mget(keys);
    }
    async getOraclePrices(symbols) {
        if (!symbols.length) {
            return [];
        }
        const keys = symbols.map((symbol) => `${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`);
        return await this.redisService.getClient().mget(keys);
    }
    async getLastUpdate() {
        const lastUpdate = await this.redisService.getClient().get(`${index_const_1.INDEX_PRICE_PREFIX}last_update`);
        return lastUpdate ? Number(lastUpdate) : 0;
    }
    async getUpdateCount() {
        const updateCount = await this.redisService.getClient().get(`${index_const_1.INDEX_PRICE_PREFIX}update_count`);
        return updateCount ? Number(updateCount) : 0;
    }
    async getUpdateError() {
        return this.redisService.getClient().get(`${index_const_1.INDEX_PRICE_PREFIX}error`);
    }
    async saveIndexPrice(symbol, price) {
        const symbolUsdm = symbol.replace('USDT', 'USDM');
        await Promise.all([
            this.redisService.getClient().set(`${index_const_1.INDEX_PRICE_PREFIX}${symbol}`, price),
            this.redisService.getClient().set(`${index_const_1.INDEX_PRICE_PREFIX}${symbolUsdm}`, price),
        ]);
    }
    async saveOraclePrice(symbol, price) {
        const symbolUsdm = symbol.replace('USDT', 'USDM');
        await Promise.all([
            this.redisService.getClient().set(`${index_const_1.ORACLE_PRICE_PREFIX}${symbolUsdm}`, price),
            this.redisService.getClient().set(`${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`, price),
        ]);
    }
    async getMetaCandle() {
        const data = await this.metaRepositoryReport.findOne({ name: 'MetaCandle' });
        return data == undefined || data.data == undefined ? undefined : JSON.parse(data.data);
    }
    async getMetaWeight() {
        const data = await this.metaRepositoryReport.findOne({ name: 'MetaWeight' });
        return data == undefined || data.data == undefined ? undefined : JSON.parse(data.data);
    }
    async getMetaMarket() {
        const data = await this.metaRepositoryReport.findOne({ name: 'MetaMarket' });
        return data == undefined || data.data == undefined ? undefined : JSON.parse(data.data);
    }
    async initMeta(name, data) {
        await this.metaRepositoryMaster.save({ name: name, data: data });
    }
    async _updateMeta(name, data) {
        await this.metaRepositoryMaster.update({ name: name }, { data: data });
    }
    async updateMeta() {
        await this._updateMeta('MetaMarket', JSON.stringify(CONST.MetaMarket));
        await this._updateMeta('MetaCandle', JSON.stringify(CONST.MetaCandle));
        await this._updateMeta('MetaWeight', JSON.stringify(CONST.MetaWeightGroup));
    }
    async loadMeta() {
        this.metaMarket = await this.getMetaMarket();
        this.metaCandle = await this.getMetaCandle();
        this.metaWeight = await this.getMetaWeight();
        if (this.metaMarket == undefined) {
            this.metaMarket = CONST.MetaMarket;
            await this.initMeta('MetaMarket', JSON.stringify(this.metaMarket));
        }
        if (this.metaCandle == undefined) {
            this.metaCandle = CONST.MetaCandle;
            await this.initMeta('MetaCandle', JSON.stringify(this.metaCandle));
        }
        if (this.metaWeight == undefined) {
            this.metaWeight = CONST.MetaWeightGroup;
            await this.initMeta('MetaWeight', JSON.stringify(this.metaWeight));
        }
    }
    async loadInstruments() {
        const instruments = await this.instrumentService.find();
        for (const instrument of instruments) {
            this.instrumentMap[instrument.symbol] = instrument;
        }
    }
    async getMovingAveragePrice(symbol, indexPrice) {
        let time = Math.floor(new Date().getTime() / 1000);
        time = time - (time % 60);
        let total = 0;
        let count = 0;
        let previousOrderbook = await this.cacheService.get(orderbook_service_1.OrderbookService.getOrderbookKey(symbol));
        for (let i = 0; i < 30; i++) {
            let difference;
            let orderbook = await this.cacheService.get(`${orderbook_service_1.OrderbookService.getOrderbookKey(symbol)}${time - 60 * i}`);
            if (!orderbook) {
                orderbook = previousOrderbook;
            }
            else {
                previousOrderbook = orderbook;
            }
            if ((orderbook === null || orderbook === void 0 ? void 0 : orderbook.bids.length) == 0 && (orderbook === null || orderbook === void 0 ? void 0 : orderbook.asks.length) == 0)
                continue;
            if ((orderbook === null || orderbook === void 0 ? void 0 : orderbook.bids.length) > 0 && (orderbook === null || orderbook === void 0 ? void 0 : orderbook.asks.length) == 0) {
                difference = Number(orderbook === null || orderbook === void 0 ? void 0 : orderbook.bids[0][0]) - indexPrice;
            }
            else if ((orderbook === null || orderbook === void 0 ? void 0 : orderbook.bids.length) == 0 && (orderbook === null || orderbook === void 0 ? void 0 : orderbook.asks.length) > 0) {
                difference = Number(orderbook === null || orderbook === void 0 ? void 0 : orderbook.asks[0][0]) - indexPrice;
            }
            else {
                difference = (Number(orderbook === null || orderbook === void 0 ? void 0 : orderbook.asks[0][0]) + Number(orderbook === null || orderbook === void 0 ? void 0 : orderbook.bids[0][0])) / 2 - indexPrice;
            }
            total += difference;
            count += 1;
        }
        if (count == 0) {
            return indexPrice;
        }
        return indexPrice + total / count;
    }
    async calculateOraclePrice(symbol, indexPrice, price) {
        var _a;
        let price1;
        const fundingRateWithPercent = await this.fundingService.getFundingRates([symbol]);
        if (fundingRateWithPercent == undefined || fundingRateWithPercent.length == 0) {
            price1 = indexPrice;
        }
        else {
            const nextFunding = await this.fundingService.getNextFunding(symbol);
            const remainingHour = Number(nextFunding) - Date.now();
            const fundingRate = Number(fundingRateWithPercent[0]) / 100;
            price1 = indexPrice * (1 + (fundingRate * remainingHour) / funding_const_1.FUNDING_TTL);
            console.log("................................................");
            console.log("symbol ", symbol);
            console.log("indexPrice ", indexPrice);
            console.log("fundingRate ", fundingRate);
            console.log("remainingHour ", remainingHour);
            console.log("FUNDING_TTL ", funding_const_1.FUNDING_TTL);
            console.log("price1 ", price1);
        }
        const instrument = this.instrumentMap[symbol];
        const tickSize = parseFloat(instrument === null || instrument === void 0 ? void 0 : instrument.tickSize) ? parseFloat(instrument === null || instrument === void 0 ? void 0 : instrument.tickSize) : index_const_1.TICK_SIZE_DEFAULT;
        const precision = -Math.ceil(Math.log10(tickSize));
        const roundedIndexPrice = indexPrice.toFixed(precision);
        const oraclePrice = price1.toFixed(precision);
        const tickers = await this.cacheService.get(ticker_const_1.TICKERS_KEY);
        const ticker = tickers === null || tickers === void 0 ? void 0 : tickers.find((ticker) => ticker.symbol === symbol);
        const lastPrice = (_a = ticker === null || ticker === void 0 ? void 0 : ticker.lastPrice) !== null && _a !== void 0 ? _a : null;
        await Promise.all([this.saveIndexPrice(symbol, price), this.saveOraclePrice(symbol, oraclePrice.toString())]);
        console.log("----------------------------------------");
        console.log(symbol);
        const data = {
            code: matching_engine_const_1.CommandCode.LIQUIDATE,
            data: { symbol, oraclePrice, indexPrice: roundedIndexPrice, lastPrice },
        };
        const symbolUsdm = symbol.replace('USDT', 'USDM');
        const dataUsdm = {
            code: matching_engine_const_1.CommandCode.LIQUIDATE,
            data: { symbol: symbolUsdm, oraclePrice, indexPrice: roundedIndexPrice, lastPrice },
        };
        this.logger.log(`Sending data to matching engine ${JSON.stringify(data)}`);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, data);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, dataUsdm);
    }
    async fakeMarkPrice(oraclePrice, symbol) {
        const data = {
            code: matching_engine_const_1.CommandCode.LIQUIDATE,
            data: { symbol, oraclePrice, indexPrice: oraclePrice },
        };
        await this.saveOraclePriceBySymbol(symbol, oraclePrice.toString());
        this.logger.log(`Sending data to matching engine ${JSON.stringify(data)}`);
        await this.kafkaClient.sendPrice(kafka_enum_1.KafkaTopics.matching_engine_input, data);
        return 'success';
    }
    async saveOraclePriceBySymbol(symbol, price) {
        await this.redisService.getClient().set(`${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`, price);
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'start-get-index-price',
        description: 'Start the job to get market prices,\
                   the job will start and loop infinite, \
                   only stop when system crash',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], IndexService.prototype, "syncMarketData", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'start-update-meta',
        description: 'Start the job to update metadata for crawling markets',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], IndexService.prototype, "updateMeta", null);
IndexService = IndexService_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(market_data_repository_1.MarketDataRepository, 'master')),
    tslib_1.__param(1, typeorm_1.InjectRepository(market_data_repository_1.MarketDataRepository, 'report')),
    tslib_1.__param(2, typeorm_1.InjectRepository(market_indices_repository_1.MarketIndexRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(market_indices_repository_1.MarketIndexRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(metadata_repository_1.MetadataRepository, 'master')),
    tslib_1.__param(5, typeorm_1.InjectRepository(metadata_repository_1.MetadataRepository, 'report')),
    tslib_1.__param(6, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(8, typeorm_1.InjectConnection('master')),
    tslib_1.__param(14, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [market_data_repository_1.MarketDataRepository,
        market_data_repository_1.MarketDataRepository,
        market_indices_repository_1.MarketIndexRepository,
        market_indices_repository_1.MarketIndexRepository,
        metadata_repository_1.MetadataRepository,
        metadata_repository_1.MetadataRepository, Object, nestjs_redis_1.RedisService,
        typeorm_2.Connection,
        https_client_1.HttpClient,
        kafka_client_1.KafkaClient,
        instrument_service_1.InstrumentService,
        orderbook_service_1.OrderbookService,
        funding_service_1.FundingService, Object])
], IndexService);
exports.IndexService = IndexService;
//# sourceMappingURL=index.service.js.map