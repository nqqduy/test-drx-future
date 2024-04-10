"use strict";
var CandleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bignumber_js_1 = require("bignumber.js");
const nestjs_redis_1 = require("nestjs-redis");
const kafka_1 = require("../../configs/kafka");
const candles_entity_1 = require("../../models/entities/candles.entity");
const candles_repository_1 = require("../../models/repositories/candles.repository");
const metadata_repository_1 = require("../../models/repositories/metadata.repository");
const CONST = require("./candle.const");
const candle_const_1 = require("./candle.const");
const candle_dto_1 = require("./candle.dto");
const instrument_service_1 = require("../instrument/instrument.service");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const typeorm_2 = require("typeorm");
const index_const_1 = require("../index/index.const");
const instrument_const_1 = require("../instrument/instrument.const");
const ticker_const_1 = require("../ticker/ticker.const");
let CandleService = CandleService_1 = class CandleService {
    constructor(instrumentService, candleRepositoryMaster, candleRepositoryReport, metadataRepositoryMaster, metadataRepositoryReport, cacheService, redisService, connection) {
        this.instrumentService = instrumentService;
        this.candleRepositoryMaster = candleRepositoryMaster;
        this.candleRepositoryReport = candleRepositoryReport;
        this.metadataRepositoryMaster = metadataRepositoryMaster;
        this.metadataRepositoryReport = metadataRepositoryReport;
        this.cacheService = cacheService;
        this.redisService = redisService;
        this.connection = connection;
        this.logger = new common_1.Logger(CandleService_1.name);
        this.resolutions = [candle_const_1.RESOLUTION_15MINUTES, candle_const_1.RESOLUTION_HOUR];
    }
    getMinute(epoch) {
        if (epoch > Math.pow(10, 10)) {
            epoch = Math.floor(epoch / 1000);
        }
        if (epoch < 1200000000 || epoch > 10000000000)
            throw 'Epoch time input error!!! ' + __filename;
        return epoch - (epoch % 60);
    }
    getSecond(epoch) {
        if (epoch > Math.pow(10, 10)) {
            epoch = Math.floor(epoch / 1000);
        }
        return epoch;
    }
    async storeCandle(symbols) {
        for (const symbol of symbols) {
            console.log("===========================================");
            console.log(symbol);
            const lastCachedCandle = await this.cacheService.get(this.getLastCandleKey(symbol));
            let latest = (lastCachedCandle === null || lastCachedCandle === void 0 ? void 0 : lastCachedCandle.minute) || 0;
            const now = Math.floor(Date.now() / 60000) * 60;
            const twoDaysAgo = now - 86400 * 2;
            latest = Math.max(latest - (latest % 60), twoDaysAgo);
            latest = Math.min(latest, now - 60);
            let lastCandle = await this.getLastCandleFromDatabase(symbol, candle_const_1.RESOLUTION_MINUTE);
            const fromTime = lastCandle.minute > 0 ? lastCandle.minute + 60 : latest;
            for (let i = fromTime; i <= latest; i += 60) {
                let candleData = await this.cacheService.get(this.getCandleKey(symbol, i));
                if (!candleData) {
                    candleData = {
                        symbol: symbol,
                        minute: i,
                        resolution: candle_const_1.RESOLUTION_MINUTE,
                        low: lastCandle.close,
                        high: lastCandle.close,
                        open: lastCandle.close,
                        close: lastCandle.close,
                        lastTradeTime: lastCandle.lastTradeTime,
                        volume: '0',
                    };
                }
                lastCandle = candleData;
                await this.candleRepositoryMaster.save(candleData);
                await this.saveExtraResolutions(candleData);
            }
        }
    }
    async handleMessage(commandOutputs) {
        for (const element of commandOutputs) {
            if (element.trades != undefined) {
                for (const trade of element.trades) {
                    this.logger.log(`Processing trade ${JSON.stringify(trade)}`);
                    const data = {
                        price: trade.price,
                        volume: new bignumber_js_1.default(trade.price).times(trade.quantity).toString(),
                        updatedAt: Math.floor(trade.updatedAt / 1000),
                        symbol: trade.symbol,
                    };
                    await this.handleTrade(data);
                }
            }
        }
    }
    async handleTrade(data) {
        const minute = this.getMinute(Number(data.updatedAt));
        const cachedCandle = await this.cacheService.get(this.getCandleKey(data.symbol, minute));
        let candle;
        if (!cachedCandle) {
            const lastCandle = await this.getLastCandle(data.symbol, candle_const_1.RESOLUTION_MINUTE);
            candle = {
                symbol: data.symbol,
                minute: minute,
                resolution: candle_const_1.RESOLUTION_MINUTE,
                low: bignumber_js_1.default.min(data.price, lastCandle.close).toString(),
                high: bignumber_js_1.default.max(data.price, lastCandle.close).toString(),
                open: lastCandle.close,
                close: data.price,
                volume: data.volume,
                lastTradeTime: data.updatedAt,
            };
        }
        else {
            if (cachedCandle.lastTradeTime > data.updatedAt) {
                return;
            }
            candle = {
                symbol: data.symbol,
                minute: minute,
                resolution: candle_const_1.RESOLUTION_MINUTE,
                low: bignumber_js_1.default.min(data.price, cachedCandle.low).toString(),
                high: bignumber_js_1.default.max(data.price, cachedCandle.high).toString(),
                open: cachedCandle.open,
                close: data.price,
                volume: new bignumber_js_1.default(cachedCandle.volume).plus(data.volume).toString(),
                lastTradeTime: data.updatedAt,
            };
        }
        this.logger.log(`Save candle ${JSON.stringify(candle)}`);
        await this.cacheService.set(this.getCandleKey(data.symbol, minute), candle, { ttl: CONST.CANDLE_TTL });
        await this.cacheService.set(this.getLastCandleKey(data.symbol), candle, {
            ttl: CONST.CANDLE_TTL,
        });
    }
    async getCandles(symbol, from, to, resolution) {
        const baseUnit = 60000;
        const resolutionMap = {
            '1': baseUnit,
            '3': baseUnit * 3,
            '5': baseUnit * 5,
            '15': baseUnit * 15,
            '30': baseUnit * 30,
            '60': baseUnit * 60,
            '120': baseUnit * 60 * 2,
            '240': baseUnit * 60 * 4,
            '360': baseUnit * 60 * 6,
            '480': baseUnit * 60 * 8,
            '720': baseUnit * 60 * 12,
            '1d': baseUnit * 60 * 24,
            '1D': baseUnit * 60 * 24,
            D: baseUnit * 60 * 24,
            '3D': baseUnit * 60 * 24 * 3,
            '7D': baseUnit * 60 * 24 * 7,
            '30D': baseUnit * 60 * 24 * 30,
        };
        const convertedResolution = resolutionMap[resolution];
        if (convertedResolution) {
            return await this._getCandles(symbol, this.standardizeCandleTime(from, convertedResolution), this.standardizeCandleTime(to, convertedResolution) + convertedResolution - 1, convertedResolution);
        }
        else {
            return [];
        }
    }
    async getCandlesData(symbol, from, to, resolution) {
        from = this.getMinute(from);
        to = this.getMinute(to);
        const resolutionInSeconds = resolution / 1000;
        let queryResolution = candle_const_1.RESOLUTION_MINUTE;
        for (const supportedResolution of this.resolutions) {
            if (resolutionInSeconds > supportedResolution) {
                queryResolution = supportedResolution;
            }
        }
        return await this.candleRepositoryReport.find({
            select: ['symbol', 'low', 'high', 'open', 'close', 'volume', 'minute', 'lastTradeTime', 'createdAt'],
            where: {
                symbol: typeorm_2.Equal(symbol),
                resolution: queryResolution,
                minute: typeorm_2.Between(from, to),
            },
            order: {
                minute: 'ASC',
            },
        });
    }
    async syncCandles() {
        while (true) {
            let symbols = await this.cacheService.get(instrument_const_1.SYMBOL_CACHE);
            if (!symbols) {
                const instruments = await this.instrumentService.getAllInstruments();
                symbols = instruments.map((instrument) => instrument.symbol);
                await this.cacheService.set(instrument_const_1.SYMBOL_CACHE, symbols, { ttl: 0 });
            }
            console.log("-----------------------------------------");
            console.log(symbols);
            await this.storeCandle(symbols);
            await this.setLastUpdate();
            await this.cacheService.set(candle_const_1.KEY_CACHE_HEALTHCHECK_SYNC_CANDLE, true, { ttl: 60 + 60 });
            await new Promise((resolve) => setTimeout(resolve, 60000));
        }
    }
    async setLastUpdate() {
        await this.redisService.getClient().set(`candle_sync_last_update`, Date.now());
    }
    async getLastUpdate() {
        const value = await this.redisService.getClient().get(`candle_sync_last_update`);
        return value ? Number(value) : 0;
    }
    async syncTrades() {
        const consumer = kafka_1.kafka.consumer({ groupId: kafka_enum_1.KafkaGroups.candles });
        await consumer.connect();
        await consumer.subscribe({ topic: kafka_enum_1.KafkaTopics.matching_engine_output });
        await consumer.run({
            eachMessage: async ({ message }) => {
                let data = JSON.parse('{}');
                try {
                    data = JSON.parse(message.value.toString());
                }
                catch (_a) {
                    console.log('invalid data');
                    return;
                }
                await this.handleMessage(data);
            },
        });
        return new Promise(() => { });
    }
    async saveExtraResolutions(candleData) {
        for (const resolution of this.resolutions) {
            await this.saveCandleInResolution(candleData, resolution);
        }
    }
    async saveCandleInResolution(candleData, resolution) {
        const candleTime = candleData.minute - (candleData.minute % resolution);
        const lastCandleBefore = await this.candleRepositoryReport.getLastCandleBefore(candleData.symbol, candleTime);
        const candles = await this.candleRepositoryReport.getCandlesInRange(candleData.symbol, candleTime, resolution);
        const lastCandleOfResolution = await this.candleRepositoryReport.getLastCandleOfResolution(candleData.symbol, resolution);
        if (lastCandleOfResolution) {
            for (let time = lastCandleOfResolution.minute + resolution; time < candleTime; time += resolution) {
                await this.candleRepositoryMaster.save({
                    symbol: candleData.symbol,
                    minute: time,
                    resolution: resolution,
                    low: lastCandleOfResolution.close,
                    high: lastCandleOfResolution.close,
                    open: lastCandleOfResolution.close,
                    close: lastCandleOfResolution.close,
                    lastTradeTime: lastCandleOfResolution.lastTradeTime,
                    volume: '0',
                });
            }
        }
        const open = this.getOpenPrice(lastCandleBefore, candles);
        const close = this.getClosePrice(lastCandleBefore, candles);
        const { low, high, volume } = this.combineCandlesData(lastCandleBefore, candles);
        if ((lastCandleOfResolution === null || lastCandleOfResolution === void 0 ? void 0 : lastCandleOfResolution.minute) === candleTime) {
            await this.candleRepositoryMaster.update({
                symbol: candleData.symbol,
                minute: candleTime,
                resolution,
            }, {
                low,
                high,
                open,
                close,
                volume,
            });
        }
        else {
            await this.candleRepositoryMaster.save({
                symbol: candleData.symbol,
                minute: candleTime,
                resolution,
                low,
                high,
                open,
                close,
                lastTradeTime: 0,
                volume,
            });
        }
    }
    getOpenPrice(lastCandleBefore, candles) {
        if (lastCandleBefore) {
            return lastCandleBefore.close;
        }
        else {
            if (candles.length > 0) {
                return candles[0].open;
            }
        }
        return '0';
    }
    getClosePrice(lastCandleBefore, candles) {
        if (candles.length > 0) {
            return candles[candles.length - 1].close;
        }
        else {
            if (lastCandleBefore) {
                return lastCandleBefore.close;
            }
        }
        return '0';
    }
    combineCandlesData(lastCandleData, candles) {
        if (!lastCandleData && candles.length === 0) {
            return { low: '0', high: '0', volume: '0' };
        }
        let low = Number.MAX_SAFE_INTEGER.toString();
        let high = '0';
        let volume = '0';
        for (const candle of candles) {
            low = bignumber_js_1.default.min(low, candle.low).toString();
            high = bignumber_js_1.default.max(high, candle.high).toString();
            volume = new bignumber_js_1.default(volume).plus(candle.volume).toString();
        }
        if (lastCandleData) {
            low = bignumber_js_1.default.min(low, lastCandleData.close).toString();
            high = bignumber_js_1.default.max(high, lastCandleData.close).toString();
        }
        return { low, high, volume };
    }
    async getLastCandle(symbol, resolution) {
        const lastCandle = await this.cacheService.get(this.getLastCandleKey(symbol));
        if (!lastCandle) {
            return this.getLastCandleFromDatabase(symbol, resolution);
        }
        return lastCandle;
    }
    async getLastCandleFromDatabase(symbol, resolution) {
        var _a;
        const lastCandle = await this.candleRepositoryReport.findOne({
            where: { symbol, resolution },
            order: { minute: 'DESC' },
        });
        if (lastCandle) {
            return lastCandle;
        }
        else {
            const [tickers] = await Promise.all([this.cacheService.get(ticker_const_1.TICKERS_KEY)]);
            const lastPriceFromIndex = await this.cacheService.get(`${index_const_1.LAST_PRICE_PREFIX}${symbol}`);
            let lastPrice = ((_a = tickers.find((item) => item.symbol == symbol)) === null || _a === void 0 ? void 0 : _a.lastPrice) || 0;
            if (lastPriceFromIndex) {
                lastPrice = lastPriceFromIndex;
            }
            const candle = {
                symbol: '',
                minute: 0,
                resolution: candle_const_1.RESOLUTION_MINUTE,
                low: new bignumber_js_1.default(lastPrice).toString(),
                high: new bignumber_js_1.default(lastPrice).toString(),
                open: new bignumber_js_1.default(lastPrice).toString(),
                close: new bignumber_js_1.default(lastPrice).toString(),
                volume: '0',
                lastTradeTime: 0,
            };
            return Object.assign(Object.assign({}, candle), { symbol });
        }
    }
    getCandleKey(symbol, minute) {
        return `${CONST.PREFIX_CACHE}${symbol}${String(minute)}`;
    }
    getLastCandleKey(symbol) {
        return `${CONST.PREFIX_CACHE}${symbol}latest`;
    }
    async _getCandles(symbol, from, to, resolution) {
        let rows = await this.getCandlesData(symbol, from, to, resolution);
        rows = await this.addCandlesFromCache(rows, symbol, from, to);
        let candles = [];
        if (rows.length > 0) {
            let currentCandle = this.getCandleFromEntity(rows.shift(), resolution);
            for (const row of rows) {
                const candleTime = this.getCandleTime(row.minute, resolution);
                if (candleTime === currentCandle.time) {
                    currentCandle.low = Math.min(currentCandle.low, Number(row.low));
                    currentCandle.high = Math.max(currentCandle.high, Number(row.high));
                    currentCandle.close = Number(row.close);
                    currentCandle.volume = currentCandle.volume + Number(row.volume);
                }
                else {
                    candles.push(currentCandle);
                    currentCandle = this.getCandleFromEntity(row, resolution);
                }
            }
            candles.push(currentCandle);
        }
        candles = await this.addMissingHeadCandles(from, to, resolution, candles, symbol);
        candles = this.addMissingTailCandles(from, to, resolution, candles);
        return candles;
    }
    getCandleTime(minute, resolution) {
        const timeInMilliSeconds = Number(minute) * 1000;
        return this.standardizeCandleTime(timeInMilliSeconds, resolution);
    }
    standardizeCandleTime(time, resolution) {
        return time - (time % resolution);
    }
    async addCandlesFromCache(rows, symbol, from, to) {
        const lastCandle = await this.cacheService.get(this.getLastCandleKey(symbol));
        let previousCandle;
        if (lastCandle) {
            previousCandle = await this.cacheService.get(this.getCandleKey(symbol, lastCandle.minute - 60));
        }
        rows = this.addCandleFromCache(rows, from, to, previousCandle);
        rows = this.addCandleFromCache(rows, from, to, lastCandle);
        return rows;
    }
    addCandleFromCache(rows, from, to, cachedCandle) {
        if (!cachedCandle) {
            return rows;
        }
        if (cachedCandle.minute > from / 1000 && cachedCandle.minute < to / 1000) {
            if (rows.length === 0) {
                rows.push(cachedCandle);
            }
            else if (cachedCandle.minute > rows[rows.length - 1].minute) {
                const lastClose = rows[rows.length - 1].close;
                const startTime = rows[rows.length - 1].minute + 60;
                for (let i = startTime; i < cachedCandle.minute; i += 60) {
                    rows.push({
                        symbol: '',
                        open: lastClose,
                        close: lastClose,
                        low: lastClose,
                        high: lastClose,
                        volume: '0',
                        minute: i,
                        resolution: candle_const_1.RESOLUTION_MINUTE,
                        lastTradeTime: 0,
                    });
                }
                rows.push(cachedCandle);
            }
        }
        return rows;
    }
    getCandleFromEntity(entity, resolution) {
        return {
            open: parseFloat(entity.open),
            close: parseFloat(entity.close),
            low: parseFloat(entity.low),
            high: parseFloat(entity.high),
            volume: parseFloat(entity.volume),
            time: this.getCandleTime(entity.minute, resolution),
        };
    }
    async addMissingHeadCandles(from, to, resolution, candles, symbol) {
        var _a;
        const startTime = from;
        const endTime = candles.length > 0 ? candles[0].time - resolution : to;
        const missingCandles = [];
        const [tickers] = await Promise.all([this.cacheService.get(ticker_const_1.TICKERS_KEY)]);
        const lastPriceFromIndex = await this.cacheService.get(`${index_const_1.LAST_PRICE_PREFIX}${symbol}`);
        let lastPrice = ((_a = tickers.find((item) => item.symbol == symbol)) === null || _a === void 0 ? void 0 : _a.lastPrice) || 0;
        if (lastPriceFromIndex) {
            lastPrice = lastPriceFromIndex;
        }
        for (let i = startTime; i <= endTime; i += resolution) {
            missingCandles.push({
                open: new bignumber_js_1.default(lastPrice).toNumber(),
                close: new bignumber_js_1.default(lastPrice).toNumber(),
                low: new bignumber_js_1.default(lastPrice).toNumber(),
                high: new bignumber_js_1.default(lastPrice).toNumber(),
                volume: 0,
                time: i,
            });
        }
        if (missingCandles.length > 0 && candles.length > 0) {
            candles[0].open = missingCandles[missingCandles.length - 1].close;
        }
        candles = missingCandles.concat(candles);
        return candles;
    }
    addMissingTailCandles(from, to, resolution, candles) {
        const lastClose = candles.length > 0 ? candles[candles.length - 1].close : 0;
        const startTime = candles.length > 0 ? candles[candles.length - 1].time + resolution : from;
        const endTime = to;
        const missingCandles = [];
        for (let i = startTime; i <= endTime; i += resolution) {
            missingCandles.push({
                open: lastClose,
                close: lastClose,
                low: lastClose,
                high: lastClose,
                volume: 0,
                time: i,
            });
        }
        candles = candles.concat(missingCandles);
        return candles;
    }
};
CandleService = CandleService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(1, typeorm_1.InjectRepository(candles_repository_1.CandlesRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(candles_repository_1.CandlesRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(metadata_repository_1.MetadataRepository, 'master')),
    tslib_1.__param(4, typeorm_1.InjectRepository(metadata_repository_1.MetadataRepository, 'report')),
    tslib_1.__param(5, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(7, typeorm_1.InjectConnection('master')),
    tslib_1.__metadata("design:paramtypes", [instrument_service_1.InstrumentService,
        candles_repository_1.CandlesRepository,
        candles_repository_1.CandlesRepository,
        metadata_repository_1.MetadataRepository,
        metadata_repository_1.MetadataRepository, Object, nestjs_redis_1.RedisService,
        typeorm_2.Connection])
], CandleService);
exports.CandleService = CandleService;
//# sourceMappingURL=candle.service.js.map