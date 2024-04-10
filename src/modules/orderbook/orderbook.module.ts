import { CacheModule, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';
import { DatabaseCommonModule } from 'src/models/database-common';
import { OrderbookConsole } from 'src/modules/orderbook/orderbook.console';
import { OrderbookController } from 'src/modules/orderbook/orderbook.controller';
import { OrderbookService } from 'src/modules/orderbook/orderbook.service';

@Module({
  providers: [Logger, OrderbookService, OrderbookConsole],
  controllers: [OrderbookController],
  imports: [
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
    }),
    DatabaseCommonModule,
  ],
  exports: [OrderbookService],
})
export class OrderbookModule {}
