import { Cache } from 'cache-manager';
import { Producer } from 'kafkajs';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { BaseEngineService } from 'src/modules/matching-engine/base-engine.service';
import { Ticker } from 'src/modules/ticker/ticker.const';
import { TradeService } from 'src/modules/trade/trade.service';
import { FundingService } from '../funding/funding.service';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
export declare class TickerService extends BaseEngineService {
    cacheManager: Cache;
    private readonly instrumentService;
    private readonly tradeService;
    private readonly instrumentRepoReport;
    private readonly fundingService;
    constructor(cacheManager: Cache, instrumentService: InstrumentService, tradeService: TradeService, instrumentRepoReport: InstrumentRepository, fundingService: FundingService);
    getTickers(contractType?: string, symbol?: string): Promise<Ticker[]>;
    loadInstruments(producer: Producer): Promise<void>;
    loadTrades(producer: Producer): Promise<void>;
    startEngine(producer: Producer): Promise<void>;
    private loadYesterdayTrades;
}
