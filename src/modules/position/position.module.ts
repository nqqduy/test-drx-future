import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';
import { AccountsModule } from 'src/modules/account/account.module';
import { PositionController } from 'src/modules/position/position.controller';
import { PositionService } from 'src/modules/position/position.service';
import { IndexModule } from '../index/index.module';
import { InstrumentModule } from '../instrument/instrument.module';
import { TradingRulesModule } from '../trading-rules/trading-rules.module';
import { PositionConsole } from './position.console';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    AccountsModule,
    InstrumentModule,
    TradingRulesModule,
    IndexModule,
  ],
  providers: [PositionService, PositionConsole],
  controllers: [PositionController],
  exports: [PositionService],
})
export class PositionModule {}
