export declare class PositionEntity {
    id: number;
    accountId: number;
    userId: number;
    symbol: string;
    leverage: string;
    currentQty: string;
    liquidationPrice: string;
    bankruptPrice: string;
    entryPrice: string;
    entryValue: string;
    liquidationProgress: number;
    takeProfitOrderId: number;
    stopLossOrderId: number;
    adjustMargin: string;
    isCross: boolean;
    pnlRanking: string;
    operationId: string;
    asset: string;
    contractType: string;
    marBuy: string;
    marSel: string;
    orderCost: string;
    positionMargin: string;
    closeSize: string;
    avgClosePrice: string;
    createdAt: Date;
    updatedAt: Date;
}
