export declare const INDEX_PRICE_PREFIX = "instrument_index_price_";
export declare const ORACLE_PRICE_PREFIX = "instrument_oracle_price_";
export declare const TICK_SIZE_DEFAULT = 0.01;
export declare const NEXT_TIME_MARKET = "next_time_market_";
export declare const LAST_PRICE_PREFIX = "instrument_last_price_";
export declare const KEY_CACHE_HEALTHCHECK_INDEX_PRICE = "healthcheck_index_price";
export declare const INDEX_PRICE_EXPRIRE_TIME: number;
export declare const MetaWeightGroup: {
    BTCUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    ETHUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    BNBUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    LTCUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    XRPUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    SOLUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    TRXUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    MATICUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    LINKUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    MANAUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    FILUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    ATOMUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    AAVEUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    DOGEUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    DOTUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    UNIUSDT: {
        binance: number;
        huobi: number;
        okx: number;
    };
    BTCUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    ETHUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    BNBUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    LTCUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    XRPUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    USDTUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    SOLUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    TRXUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    MATICUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    LINKUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    MANAUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    FILUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    ATOMUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    AAVEUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    DOGEUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    DOTUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
    UNIUSD: {
        binance: number;
        huobi: number;
        okx: number;
    };
};
export declare const MetaCommon: {
    timeframe: number;
};
export declare const MetaCandle: {
    binance: {
        baseUrl: string;
        pairs: {
            symbol: string;
            group: string;
        }[];
        interval: string;
        limit: number;
    };
    coinbase: {
        baseUrl: string;
        pairs: {
            symbol: string;
            group: string;
        }[];
        granularity: number;
    };
};
export declare const MetaMarket: {
    binance: {
        baseUrl: string;
        pairs: {
            symbol: string;
            group: string;
        }[];
    };
    huobi: {
        baseUrl: string;
        pairs: {
            symbol: string;
            group: string;
        }[];
    };
    okx: {
        baseUrl: string;
        pairs: {
            symbol: string;
            group: string;
        }[];
    };
};
export declare const deviatePercentUSDTUSD: number[];
