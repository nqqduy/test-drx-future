import { CacheModule, HttpModule, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';
import { AccountsModule } from 'src/modules/account/account.module';
import { FundingModule } from 'src/modules/funding/funding.module';
import { IndexModule } from 'src/modules/index/index.module';
import { InstrumentModule } from 'src/modules/instrument/instrument.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { MatchingEngineTestConsole } from 'src/modules/matching-engine/matching-engine-test.console';
import { MatchingEngineConsole } from 'src/modules/matching-engine/matching-engine.console';
import { MatchingEngineService } from 'src/modules/matching-engine/matching-engine.service';
import { NotificationService } from 'src/modules/matching-engine/notifications.service';
import { OrderController } from 'src/modules/order/order.controller';
import { OrderModule } from 'src/modules/order/order.module';
import { PositionModule } from 'src/modules/position/position.module';
import { TradeModule } from 'src/modules/trade/trade.module';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { LeverageModule } from '../leverage-margin/leverage-margin.module';
import { BalanceModule } from '../balance/balance.module';
import { UserSettingModule } from '../user-setting/user-setting.module';
import { UserSettingeService } from '../user-setting/user-setting.service';
import { RedisModule } from 'nestjs-redis';
import { UsersModule } from '../user/users.module';

@Module({
  providers: [
    Logger,
    MatchingEngineService,
    MatchingEngineConsole,
    MatchingEngineTestConsole,
    NotificationService,
    UserSettingeService,
  ],
  controllers: [OrderController],
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    RedisModule.register({ ...redisConfig }),
    AccountsModule,
    FundingModule,
    IndexModule,
    InstrumentModule,
    OrderModule,
    PositionModule,
    TradeModule,
    TransactionModule,
    MailModule,
    LeverageModule,
    BalanceModule,
    MailModule,
    UserSettingModule,
    HttpModule,
    UsersModule,
  ],
  exports: [],
})
export class MatchingEngineModule {}
