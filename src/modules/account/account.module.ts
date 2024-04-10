import { CacheModule, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';
import { AccountConsole } from 'src/modules/account/account.console';
import { AccountController } from 'src/modules/account/account.controller';
import { AccountService } from 'src/modules/account/account.service';
import { LatestBlockModule } from 'src/modules/latest-block/latest-block.module';
import { UsersModule } from 'src/modules/user/users.module';
import { OrderbookModule } from '../orderbook/orderbook.module';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    LatestBlockModule,
    UsersModule,
    OrderbookModule,
  ],
  providers: [AccountService, AccountConsole, Logger],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountsModule {}
