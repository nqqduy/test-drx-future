import { TradesDto } from './dto/get-trades.dto';
import { AdminTradeDto } from './dto/admin-trade.dto';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { AccountService } from 'src/modules/account/account.service';
import { FillDto } from 'src/modules/trade/dto/get-fills.dto';
import { TradeService } from 'src/modules/trade/trade.service';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { TradeHistoryDto } from './dto/trade-history.dto';
export declare class TradeController {
    private readonly tradeService;
    private readonly accountService;
    constructor(tradeService: TradeService, accountService: AccountService);
    getFillTrade(userId: number, paging: PaginationDto, tradeHistoryDto: TradeHistoryDto): Promise<ResponseDto<FillDto[]>>;
    getRecentTrades(symbol: string, paging: PaginationDto): Promise<ResponseDto<TradeEntity[]>>;
    getTrades(paging: PaginationDto, queries: AdminTradeDto): Promise<ResponseDto<TradesDto[]>>;
}
