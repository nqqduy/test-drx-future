import { Cache } from 'cache-manager';
import { RedisService } from 'nestjs-redis';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
export declare class OrderbookConsole {
    cacheManager: Cache;
    readonly kafkaClient: KafkaClient;
    private readonly redisService;
    constructor(cacheManager: Cache, kafkaClient: KafkaClient, redisService: RedisService);
    publish(): Promise<void>;
    delOrderbookCache(): Promise<void>;
    delOrderbookCacheBySymbol(symbol: string): Promise<void>;
}
