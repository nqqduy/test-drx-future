export interface Ticker {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    lastPrice: string;
    lastPriceChange: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    indexPrice: string;
    oraclePrice: string;
    fundingRate: string;
    nextFunding: number;
    contractType?: string;
}
export interface TickerLastPrice {
    symbol: string;
    lastPrice: string;
    priceChange: string;
    priceChangePercent: string;
}
export declare const TICKER_TTL = 86400000;
export declare const TICKERS_KEY = "tickers";
export declare const TICKERS_LAST_PRICE_KEY = "ticker_last_price";
