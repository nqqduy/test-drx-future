import { Cache } from 'cache-manager';
import { Orderbook } from 'src/modules/orderbook/orderbook.const';
export declare class OrderbookService {
    cacheManager: Cache;
    constructor(cacheManager: Cache);
    static getOrderbookKey(symbol: string): string;
    getOrderbook(symbol: string): Promise<Orderbook>;
}
