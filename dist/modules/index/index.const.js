"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviatePercentUSDTUSD = exports.MetaMarket = exports.MetaCandle = exports.MetaCommon = exports.MetaWeightGroup = exports.INDEX_PRICE_EXPRIRE_TIME = exports.KEY_CACHE_HEALTHCHECK_INDEX_PRICE = exports.LAST_PRICE_PREFIX = exports.NEXT_TIME_MARKET = exports.TICK_SIZE_DEFAULT = exports.ORACLE_PRICE_PREFIX = exports.INDEX_PRICE_PREFIX = void 0;
exports.INDEX_PRICE_PREFIX = 'instrument_index_price_';
exports.ORACLE_PRICE_PREFIX = 'instrument_oracle_price_';
exports.TICK_SIZE_DEFAULT = 0.01;
exports.NEXT_TIME_MARKET = 'next_time_market_';
exports.LAST_PRICE_PREFIX = 'instrument_last_price_';
exports.KEY_CACHE_HEALTHCHECK_INDEX_PRICE = 'healthcheck_index_price';
exports.INDEX_PRICE_EXPRIRE_TIME = 40 * 60;
exports.MetaWeightGroup = {
    BTCUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    ETHUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    BNBUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    LTCUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    XRPUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    SOLUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    TRXUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    MATICUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    LINKUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    MANAUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    FILUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    ATOMUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    AAVEUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    DOGEUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    DOTUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    UNIUSDT: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    BTCUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    ETHUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    BNBUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    LTCUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    XRPUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    USDTUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    SOLUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    TRXUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    MATICUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    LINKUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    MANAUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    FILUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    ATOMUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    AAVEUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    DOGEUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    DOTUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
    UNIUSD: {
        binance: 2,
        huobi: 1,
        okx: 1,
    },
};
exports.MetaCommon = {
    timeframe: 600,
};
exports.MetaCandle = {
    binance: {
        baseUrl: 'https://api1.binance.com',
        pairs: [
            { symbol: 'BTCUSDT', group: 'BTCUSD' },
            { symbol: 'ETHUSDT', group: 'ETHUSD' },
            { symbol: 'BCHUSDT', group: 'BCHUSD' },
            { symbol: 'LTCUSDT', group: 'LTCUSD' },
            { symbol: 'LINKUSDT', group: 'LINKUSD' },
            { symbol: 'ENJUSDT', group: 'ENJUSD' },
            { symbol: 'AVAXUSDT', group: 'AVAXUSD' },
            { symbol: 'MATICUSDT', group: 'MATICUSD' },
            { symbol: 'DOGEUSDT', group: 'DOGEUSD' },
            { symbol: 'SOLUSDT', group: 'SOLUSD' },
            { symbol: 'AAVEUSDT', group: 'AAVEUSD' },
            { symbol: 'ATOMUSDT', group: 'ATOMUSD' },
            { symbol: 'YFIUSDT', group: 'YFIUSD' },
            { symbol: 'UNIUSDT', group: 'UNIUSD' },
            { symbol: 'SUSHIUSDT', group: 'SUSHIUSD' },
            { symbol: 'ALGOUSDT', group: 'ALGOUSD' },
            { symbol: 'EOSUSDT', group: 'EOSUSD' },
            { symbol: 'ZECUSDT', group: 'ZECUSD' },
            { symbol: 'DOTUSDT', group: 'DOTUSD' },
            { symbol: 'MKRUSDT', group: 'MKRUSD' },
            { symbol: 'SNXUSDT', group: 'SNXUSD' },
            { symbol: 'XMRUSDT', group: 'XMRUSD' },
            { symbol: 'ZRXUSDT', group: 'ZRXUSD' },
            { symbol: 'ADAUSDT', group: 'ADAUSD' },
            { symbol: 'COMPUSDT', group: 'COMPUSD' },
        ],
        interval: '1m',
        limit: 100,
    },
    coinbase: {
        baseUrl: 'https://api.exchange.coinbase.com',
        pairs: [
            { symbol: 'BTC-USD', group: 'BTCUSD' },
            { symbol: 'ETH-USD', group: 'ETHUSD' },
        ],
        granularity: 60,
    },
};
exports.MetaMarket = {
    binance: {
        baseUrl: 'https://api1.binance.com',
        pairs: [
            { symbol: 'BTCUSDT', group: 'BTCUSDT' },
            { symbol: 'ETHUSDT', group: 'ETHUSDT' },
            { symbol: 'BNBUSDT', group: 'BNBUSDT' },
            { symbol: 'LTCUSDT', group: 'LTCUSDT' },
            { symbol: 'XRPUSDT', group: 'XRPUSDT' },
            { symbol: 'SOLUSDT', group: 'SOLUSDT' },
            { symbol: 'TRXUSDT', group: 'TRXUSDT' },
            { symbol: 'MATICUSDT', group: 'MATICUSDT' },
            { symbol: 'LINKUSDT', group: 'LINKUSDT' },
            { symbol: 'MANAUSDT', group: 'MANAUSDT' },
            { symbol: 'FILUSDT', group: 'FILUSDT' },
            { symbol: 'ATOMUSDT', group: 'ATOMUSDT' },
            { symbol: 'AAVEUSDT', group: 'AAVEUSDT' },
            { symbol: 'DOGEUSDT', group: 'DOGEUSDT' },
            { symbol: 'DOTUSDT', group: 'DOTUSDT' },
            { symbol: 'UNIUSDT', group: 'UNIUSDT' },
        ],
    },
    huobi: {
        baseUrl: 'https://api.huobi.pro',
        pairs: [
            { symbol: 'btcusdt', group: 'BTCUSDT' },
            { symbol: 'ethusdt', group: 'ETHUSDT' },
            { symbol: 'bnbusdt', group: 'BNBUSDT' },
            { symbol: 'ltcusdt', group: 'LTCUSDT' },
            { symbol: 'xrpusdt', group: 'XRPUSDT' },
            { symbol: 'solusdt', group: 'SOLUSDT' },
            { symbol: 'trxusdt', group: 'TRXUSDT' },
            { symbol: 'maticusdt', group: 'MATICUSDT' },
            { symbol: 'linkusdt', group: 'LINKUSDT' },
            { symbol: 'manausdt', group: 'MANAUSDT' },
            { symbol: 'filusdt', group: 'FILUSDT' },
            { symbol: 'atomusdt', group: 'ATOMUSDT' },
            { symbol: 'aaveusdt', group: 'AAVEUSDT' },
            { symbol: 'dogeusdt', group: 'DOGEUSDT' },
            { symbol: 'dotusdt', group: 'DOTUSDT' },
            { symbol: 'uniusdt', group: 'UNIUSDT' },
        ],
    },
    okx: {
        baseUrl: 'https://www.okx.com',
        pairs: [
            { symbol: 'BTC-USDT', group: 'BTCUSDT' },
            { symbol: 'ETH-USDT', group: 'ETHUSDT' },
            { symbol: 'BNB-USDT', group: 'BNBUSDT' },
            { symbol: 'LTC-USDT', group: 'LTCUSDT' },
            { symbol: 'XRP-USDT', group: 'XRPUSDT' },
            { symbol: 'SOL-USDT', group: 'SOLUSDT' },
            { symbol: 'TRX-USDT', group: 'TRXUSDT' },
            { symbol: 'MATIC-USDT', group: 'MATICUSDT' },
            { symbol: 'LINK-USDT', group: 'LINKUSDT' },
            { symbol: 'MANA-USDT', group: 'MANAUSDT' },
            { symbol: 'FIL-USDT', group: 'FILUSDT' },
            { symbol: 'ATOM-USDT', group: 'ATOMUSDT' },
            { symbol: 'AAVE-USDT', group: 'AAVEUSDT' },
            { symbol: 'DOGE-USDT', group: 'DOGEUSDT' },
            { symbol: 'DOT-USDT', group: 'DOTUSDT' },
            { symbol: 'UNI-USDT', group: 'UNIUSDT' },
        ],
    },
};
exports.deviatePercentUSDTUSD = [0.1, 0.5];
//# sourceMappingURL=index.const.js.map