export const ORDERBOOK_TTL = Number.MAX_SAFE_INTEGER;
export const ORDERBOOK_PREVIOUS_TTL = 3600;
export interface Orderbook {
  bids: string[][];
  asks: string[][];
}

export interface OrderbookEvent {
  symbol: string;
  orderbook: Orderbook;
  changes: Orderbook;
}
