import { CandleService } from 'src/modules/candle/candle.service';
export declare class CandleConsole {
    private readonly candleService;
    private readonly logger;
    constructor(candleService: CandleService);
    syncCandles(): Promise<void>;
    syncTrades(): Promise<void>;
}
