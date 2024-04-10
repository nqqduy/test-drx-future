import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Command, Console } from 'nestjs-console';
import { RedisService } from 'nestjs-redis';
import { ORDERBOOK_PREVIOUS_TTL, ORDERBOOK_TTL, OrderbookEvent } from 'src/modules/orderbook/orderbook.const';
import { OrderbookService } from 'src/modules/orderbook/orderbook.service';
import { KafkaGroups, KafkaTopics } from 'src/shares/enums/kafka.enum';
import { SocketEmitter } from 'src/shares/helpers/socket-emitter';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';

@Console()
@Injectable()
export class OrderbookConsole {
  constructor(
    @Inject(CACHE_MANAGER)
    public cacheManager: Cache,
    public readonly kafkaClient: KafkaClient,
    private readonly redisService: RedisService,
  ) {}

  @Command({
    command: 'orderbook:publish',
    description: 'Publish orderbook',
  })
  async publish(): Promise<void> {
    const topic = KafkaTopics.orderbook_output;
    await this.kafkaClient.consume<OrderbookEvent>(topic, KafkaGroups.orderbook, async (data) => {
      const { symbol, orderbook, changes } = data;
      await this.cacheManager.set(OrderbookService.getOrderbookKey(symbol), orderbook, { ttl: ORDERBOOK_TTL });
      // Setting interval for Moving Average (30-minute Basis)
      const dt = Math.floor(new Date().getTime() / 1000);
      await this.cacheManager.set(`${OrderbookService.getOrderbookKey(symbol)}${String(dt - (dt % 60))}`, orderbook, {
        ttl: ORDERBOOK_PREVIOUS_TTL,
      });
      SocketEmitter.getInstance().emitOrderbook(changes, symbol);
    });
    return new Promise(() => {});
  }
  @Command({
    command: 'del:orderbook:all',
    description: 'delete orderbook cache',
  })
  public async delOrderbookCache() {
    const keyOrderbookCache = await this.redisService.getClient().keys('*orderbook_*');
    if (keyOrderbookCache?.length) {
      await Promise.all([keyOrderbookCache.map((item) => this.redisService.getClient().del(item))]);
    }
  }

  @Command({
    command: 'del:orderbook <symbol>',
    description: 'delete orderbook cache',
  })
  public async delOrderbookCacheBySymbol(symbol: string) {
    await this.redisService.getClient().del(`orderbook_${symbol}`);
  }
}
