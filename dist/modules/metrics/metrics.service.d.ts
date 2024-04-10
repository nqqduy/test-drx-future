import { Cache } from 'cache-manager';
import { RedisService } from 'nestjs-redis';
export declare class MetricsService {
    private cacheManager;
    private readonly redisService;
    private registry;
    constructor(cacheManager: Cache, redisService: RedisService);
    getMetrics(): Promise<any>;
    healthcheckService(): Promise<any>;
    healcheckRedis(): Promise<any>;
}
