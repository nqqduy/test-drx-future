import { AccountEntity } from 'src/models/entities/account.entity';
import { OrderEntity } from 'src/models/entities/order.entity';
import { PositionEntity } from 'src/models/entities/position.entity';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { Notification } from 'src/modules/matching-engine/matching-engine.const';
import { Orderbook } from 'src/modules/orderbook/orderbook.const';
import { Ticker } from 'src/modules/ticker/ticker.const';
export declare class SocketEmitter {
    private static instance;
    io: any;
    private logger;
    private constructor();
    static getInstance(): SocketEmitter;
    emitTrades(trades: TradeEntity[], symbol: string): void;
    emitOrderbook(orderbook: Orderbook, symbol: string): void;
    emitTickers(tickers: Ticker[]): void;
    emitAccount(userId: number, account: AccountEntity): void;
    emitPosition(position: PositionEntity, userId: number): void;
    emitOrders(orders: OrderEntity[], userId: number): void;
    emitNotifications(notifications: Notification[], userId: number): void;
    emitAdjustLeverage(adjustLeverage: any, userId: number): void;
    emitAdjustMarginPosition(marginPosition: any, userId: number): void;
}
