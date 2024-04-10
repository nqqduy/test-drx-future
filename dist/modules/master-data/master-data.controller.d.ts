import { MasterDataService } from './master-data.service';
export declare class MasterDataController {
    private readonly masterDataService;
    constructor(masterDataService: MasterDataService);
    getMasterData(): Promise<{
        data: {
            orderType: {
                TAKE_PROFIT_LIMIT: import("../../shares/enums/order.enum").TpSlType.TAKE_PROFIT_LIMIT;
                TAKE_PROFIT_MARKET: import("../../shares/enums/order.enum").TpSlType.TAKE_PROFIT_MARKET;
                STOP_LIMIT: import("../../shares/enums/order.enum").TpSlType.STOP_LIMIT;
                STOP_MARKET: import("../../shares/enums/order.enum").TpSlType.STOP_MARKET;
                TRAILING_STOP: import("../../shares/enums/order.enum").TpSlType.TRAILING_STOP;
                LIMIT: import("../../shares/enums/order.enum").OrderType.LIMIT;
                MARKET: import("../../shares/enums/order.enum").OrderType.MARKET;
                LIQUIDATION: import("../../shares/enums/order.enum").OrderType.LIQUIDATION;
                STOP_LOSS_MARKET: import("../../shares/enums/order.enum").OrderType.STOP_LOSS_MARKET;
            };
            symbols: any[];
            tradingRules: import("../../models/entities/trading_rules.entity").TradingRulesEntity[];
            coinInfo: import("../../models/entities/coin-info.entity").CoinInfoEntity[];
            leverageMargin: import("../../models/entities/leverage-margin.entity").LeverageMarginEntity[];
            coinM: any[];
        };
    }>;
}
