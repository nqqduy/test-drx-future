export declare class CachedSymbols {
}
export declare class CandleData {
    symbol: string;
    minute: number;
    resolution: number;
    low: string;
    high: string;
    open: string;
    close: string;
    volume: string;
    lastTradeTime: number;
}
export declare const EMPTY_CANDLE: {
    symbol: string;
    minute: number;
    resolution: number;
    low: string;
    high: string;
    open: string;
    close: string;
    volume: string;
    lastTradeTime: number;
};
export interface TradeData {
    price: string;
    volume: string;
    updatedAt: number;
    symbol: string;
}
