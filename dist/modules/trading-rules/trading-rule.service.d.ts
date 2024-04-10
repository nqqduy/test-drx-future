import { TradingRulesEntity } from 'src/models/entities/trading_rules.entity';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
import { TradingRulesModeDto } from './dto/trading-rules.dto';
import { Cache } from 'cache-manager';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
export declare class TradingRulesService {
    private tradingRulesMaster;
    private readonly tradingRulesReport;
    private cacheManager;
    readonly instrumentRepoReport: InstrumentRepository;
    readonly instrumentRepoMaster: InstrumentRepository;
    readonly kafkaClient: KafkaClient;
    constructor(tradingRulesMaster: TradingRulesRepository, tradingRulesReport: TradingRulesRepository, cacheManager: Cache, instrumentRepoReport: InstrumentRepository, instrumentRepoMaster: InstrumentRepository, kafkaClient: KafkaClient);
    insertOrUpdateTradingRules(input: TradingRulesModeDto): Promise<TradingRulesEntity>;
    getAllTradingRules(input: PaginationDto): Promise<{
        list: any[];
        count: number;
    }>;
    getTradingRuleByInstrumentId(symbol: string): Promise<unknown>;
    getAllTradingRulesNoLimit(): Promise<TradingRulesEntity[]>;
}
