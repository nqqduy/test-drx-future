import { MarketCrawler } from 'src/modules/index/markets/base';
export declare class FtxCandleDTO {
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
}
export declare class Pair {
    symbol: string;
    group: string;
}
export declare class GeminiVolume {
}
export declare class GeminiData {
    ask: string;
    bid: string;
    last: string;
    volume: GeminiVolume;
}
export declare class MetaMarketDTO {
    baseUrl: string;
    pairs: Array<Pair>;
    base: MarketCrawler;
    resolution?: number | undefined;
    granularity?: number | undefined;
    interval?: number | undefined;
    limit?: number | undefined;
}
export declare class CandleResponseDTO {
    success?: any;
    result?: any;
}
export declare class CandleData {
    group?: string;
    symbol?: string;
    market: string;
    timestamp: number;
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
}
export declare class MarketData {
    market: string;
    bid: number;
    ask: number;
    index: number;
    symbol?: string;
    group?: string;
}
export declare class MetadataCandleDTO {
}
export declare class MetadataWeightGroupDTO {
}
export declare class MetadataMarketDTO {
}
export declare class BaseMarketResponseDTO {
}
export declare class BinanceResponse extends BaseMarketResponseDTO {
    bidPrice: number;
    askPrice: number;
    lastPrice: number;
}
export declare class CoinbaseResponse extends BaseMarketResponseDTO {
    bid: number;
    ask: number;
    price: number;
}
export declare class GeminiResponse extends BaseMarketResponseDTO {
    last: number;
}
export declare class HuobiData {
    price?: number;
}
export declare class HuobiTick {
    ids: number;
    ts: number;
    data: HuobiData[];
}
export declare class HuobiResponse extends BaseMarketResponseDTO {
    status: string;
    tick: HuobiTick;
}
export declare class OKXTicker {
    last: string;
    askPx: string;
    bidPx: string;
}
export declare class OKXTickerResponse extends BaseMarketResponseDTO {
    data: OKXTicker[];
}
export declare class BittrexResponse extends BaseMarketResponseDTO {
    lastTradeRate: string;
    bidRate: string;
    askRate: string;
}
export declare class HitbtcData {
    ask: string;
    bid: string;
    last: string;
}
export declare class HitbtcResponse extends BaseMarketResponseDTO {
    [key: string]: HitbtcData;
}
export declare class GateIOResponse extends BaseMarketResponseDTO {
    highestBid: string;
    lowestAsk: string;
    last: string;
}
export declare class BitmaxResponse extends BaseMarketResponseDTO {
    data: {
        close: string;
        ask: string[];
        bid: string[];
    };
}
export declare class MXCResponse extends BaseMarketResponseDTO {
    success: boolean;
    data: {
        lastPrice: number;
        bid1: number;
        ask1: number;
    };
}
export declare class BitfinexResponse extends BaseMarketResponseDTO {
    bid: string;
    ask: string;
    last_price: string;
}
export declare class BitstampResponse extends BaseMarketResponseDTO {
    bid: string;
    ask: string;
    last: string;
}
export declare class KarenData {
    a: string[];
    b: string[];
    c: string[];
}
export declare class KarenResponse extends BaseMarketResponseDTO {
    result: {
        [key: string]: KarenData;
    };
}
