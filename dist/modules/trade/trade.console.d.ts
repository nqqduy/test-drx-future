import { TradeRepository } from 'src/models/repositories/trade.repository';
import { TradeService } from 'src/modules/trade/trade.service';
export default class TradeSeedCommand {
    readonly tradeRepository: TradeRepository;
    private readonly tradeService;
    constructor(tradeRepository: TradeRepository, tradeService: TradeService);
    seedTrades(): Promise<void>;
    updateTrade(): Promise<void>;
    updateTradeEmail(): Promise<void>;
    testUpdateTradeEmail(tradeId: string): Promise<void>;
}
