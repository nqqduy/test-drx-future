import { Ticker } from 'src/modules/ticker/ticker.const';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
export declare class TickerController {
    private readonly tickerService;
    constructor(tickerService: TickerService);
    get(contractType: string, symbol: string): Promise<ResponseDto<Ticker[]>>;
}
