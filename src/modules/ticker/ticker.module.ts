import { CacheModule, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';
import { DatabaseCommonModule } from 'src/models/database-common';
import { FundingModule } from 'src/modules/funding/funding.module';
import { IndexModule } from 'src/modules/index/index.module';
import { InstrumentModule } from 'src/modules/instrument/instrument.module';
import { TickerConsole } from 'src/modules/ticker/ticker.console';
import { TickerController } from 'src/modules/ticker/ticker.controller';
import { TickerService } from 'src/modules/ticker/ticker.service';
import { TradeModule } from 'src/modules/trade/trade.module';

@Module({
  providers: [Logger, TickerService, TickerConsole],
  controllers: [TickerController],
  imports: [
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
    }),
    DatabaseCommonModule,
    FundingModule,
    InstrumentModule,
    IndexModule,
    TradeModule,
  ],
  exports: [],
})
export class TickerModule {}
