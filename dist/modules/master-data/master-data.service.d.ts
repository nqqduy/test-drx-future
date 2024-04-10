import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { TpSlType, OrderType } from 'src/shares/enums/order.enum';
import { Cache } from 'cache-manager';
import { TradingRulesService } from '../trading-rules/trading-rule.service';
import { CoinInfoService } from '../coin-info/coin-info.service';
import { LeverageMarginService } from '../leverage-margin/leverage-margin.service';
import { InstrumentService } from '../instrument/instrument.service';
export declare class MasterDataService {
    readonly instrumentRepoReport: InstrumentRepository;
    readonly instrumentRepoMaster: InstrumentRepository;
    private cacheManager;
    private readonly tradingRulesService;
    private readonly coinInfoService;
    private readonly leverageMarginService;
    private readonly instrumentService;
    constructor(instrumentRepoReport: InstrumentRepository, instrumentRepoMaster: InstrumentRepository, cacheManager: Cache, tradingRulesService: TradingRulesService, coinInfoService: CoinInfoService, leverageMarginService: LeverageMarginService, instrumentService: InstrumentService);
    getMasterData(): Promise<{
        orderType: {
            TAKE_PROFIT_LIMIT: TpSlType.TAKE_PROFIT_LIMIT;
            TAKE_PROFIT_MARKET: TpSlType.TAKE_PROFIT_MARKET;
            STOP_LIMIT: TpSlType.STOP_LIMIT;
            STOP_MARKET: TpSlType.STOP_MARKET;
            TRAILING_STOP: TpSlType.TRAILING_STOP;
            LIMIT: OrderType.LIMIT;
            MARKET: OrderType.MARKET;
            LIQUIDATION: OrderType.LIQUIDATION;
            STOP_LOSS_MARKET: OrderType.STOP_LOSS_MARKET;
        };
        symbols: any[];
        tradingRules: import("../../models/entities/trading_rules.entity").TradingRulesEntity[];
        coinInfo: import("../../models/entities/coin-info.entity").CoinInfoEntity[];
        leverageMargin: import("../../models/entities/leverage-margin.entity").LeverageMarginEntity[];
        coinM: any[];
    }>;
}
