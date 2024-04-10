import { Orderbook } from 'src/modules/orderbook/orderbook.const';
import { OrderbookService } from 'src/modules/orderbook/orderbook.service';
export declare class OrderbookController {
    private readonly orderbookService;
    constructor(orderbookService: OrderbookService);
    get(symbol: string): Promise<Orderbook>;
}
