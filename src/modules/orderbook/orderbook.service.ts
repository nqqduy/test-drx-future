import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Orderbook } from 'src/modules/orderbook/orderbook.const';

@Injectable()
export class OrderbookService {
  constructor(
    @Inject(CACHE_MANAGER)
    public cacheManager: Cache,
  ) {}

  public static getOrderbookKey(symbol: string): string {
    return `orderbook_${symbol}`;
  }

  async getOrderbook(symbol: string): Promise<Orderbook> {
    const orderbook = await this.cacheManager.get<Orderbook>(OrderbookService.getOrderbookKey(symbol));
    if (!orderbook) {
      return {
        bids: [],
        asks: [],
      };
    } else {
      return orderbook;
    }
  }
}
