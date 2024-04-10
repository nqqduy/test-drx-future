import { Cache } from 'cache-manager';
import { FundingService } from 'src/modules/funding/funding.service';
import { IndexService } from 'src/modules/index/index.service';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
export declare class TickerConsole {
    private readonly tickerService;
    cacheManager: Cache;
    readonly kafkaClient: KafkaClient;
    private readonly fundingService;
    private readonly indexService;
    constructor(tickerService: TickerService, cacheManager: Cache, kafkaClient: KafkaClient, fundingService: FundingService, indexService: IndexService);
    load(): Promise<void>;
    publish(): Promise<void>;
    private addExtraInfoToTickers;
}
