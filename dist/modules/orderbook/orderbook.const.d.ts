export declare const ORDERBOOK_TTL: number;
export declare const ORDERBOOK_PREVIOUS_TTL = 3600;
export interface Orderbook {
    bids: string[][];
    asks: string[][];
}
export interface OrderbookEvent {
    symbol: string;
    orderbook: Orderbook;
    changes: Orderbook;
}
