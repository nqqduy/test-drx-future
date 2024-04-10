import { TradeEntity } from 'src/models/entities/trade.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
import { FillDto } from 'src/modules/trade/dto/get-fills.dto';
import { TradeHistoryDto } from 'src/modules/trade/dto/trade-history.dto';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
export declare class TradeRepository extends BaseRepository<TradeEntity> {
    updateBatch(entities: TradeEntity[]): Promise<void>;
    findYesterdayTrade(date: Date, symbol: string | undefined): Promise<TradeEntity | undefined>;
    findTodayTrades(date: Date, from: number, count: number): Promise<TradeEntity[]>;
    getFills(userId: number, paging: PaginationDto, tradeHistoryDto: TradeHistoryDto): Promise<[FillDto[], number]>;
    getLastTrade(symbol: string): Promise<TradeEntity[]>;
    getDataTrade(userId: number, symbol: string, contract: string): Promise<{
        tradeBuy: any;
        tradeSell: any;
    }>;
}
