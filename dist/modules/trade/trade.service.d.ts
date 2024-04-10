import { AdminTradeDto } from './dto/admin-trade.dto';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { TradeRepository } from 'src/models/repositories/trade.repository';
import { FillDto } from 'src/modules/trade/dto/get-fills.dto';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { TradeHistoryDto } from './dto/trade-history.dto';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
export declare class TradeService {
    private tradeRepoMaster;
    private tradeRepoReport;
    readonly accountRepoReport: AccountRepository;
    readonly accountRepoMaster: AccountRepository;
    readonly userRepoReport: UserRepository;
    constructor(tradeRepoMaster: TradeRepository, tradeRepoReport: TradeRepository, accountRepoReport: AccountRepository, accountRepoMaster: AccountRepository, userRepoReport: UserRepository);
    getFillTrade(accountId: number, paging: PaginationDto, tradeHistoryDto: TradeHistoryDto): Promise<ResponseDto<FillDto[]>>;
    getRecentTrades(symbol: string, paging: PaginationDto): Promise<TradeEntity[]>;
    findYesterdayTrade(date: Date, symbol: string | undefined): Promise<TradeEntity | undefined>;
    findTodayTrades(date: Date, from: number, count: number): Promise<TradeEntity[]>;
    getLastTrade(symbol: string): Promise<TradeEntity[]>;
    getLastTradeId(): Promise<number>;
    getTrades(paging: PaginationDto, queries: AdminTradeDto): Promise<any>;
    updateTrade(): Promise<void>;
    updateTradeEmail(): Promise<void>;
    testUpdateTradeEmail(tradeId: string): Promise<void>;
}
