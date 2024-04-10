export declare class TradeEntity {
    id: number;
    buyOrderId: number;
    sellOrderId: number;
    buyAccountId: number;
    sellAccountId: number;
    buyUserId: number;
    sellUserId: number;
    symbol: string;
    price: string;
    quantity: string;
    buyFee: string;
    sellFee: string;
    realizedPnlOrderBuy: string;
    realizedPnlOrderSell: string;
    buyerIsTaker: boolean;
    note: string;
    operationId: string;
    contractType: string;
    buyEmail: string;
    sellEmail: string;
    createdAt: Date;
    updatedAt: Date;
    equals(o: TradeEntity): boolean;
}
