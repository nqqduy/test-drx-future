import { Candle } from 'src/modules/candle/candle.const';
import { CandleService } from 'src/modules/candle/candle.service';
export declare class CandlesController {
    private readonly candleService;
    constructor(candleService: CandleService);
    get1m(symbol: string, from: number, to: number, resolution: string): Promise<Candle[]>;
}
