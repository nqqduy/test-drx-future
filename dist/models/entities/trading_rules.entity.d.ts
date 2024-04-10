import { BaseEntity } from 'typeorm';
export declare class TradingRulesEntity extends BaseEntity {
    id: number;
    minTradeAmount: string;
    minOrderAmount: string;
    minPrice: string;
    limitOrderPrice: string;
    floorRatio: string;
    maxMarketOrder: string;
    limitOrderAmount: string;
    numberOpenOrders: string;
    priceProtectionThreshold: string;
    liqClearanceFee: string;
    minNotional: string;
    marketOrderPrice: string;
    isReduceOnly: boolean;
    positionsNotional: string;
    ratioOfPostion: string;
    liqMarkPrice: string;
    maxLeverage: number;
    createdAt: Date;
    updatedAt: Date;
    maxNotinal: string;
    symbol: string;
    maxOrderAmount: string;
}
