import { ContractType } from 'src/shares/enums/order.enum';
export declare class TradingRulesModeDto {
    symbol: string;
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
    contractType: ContractType;
    maxOrderAmount: string;
}
