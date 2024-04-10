import { CacheModule, Logger, Module } from '@nestjs/common';
import { redisConfig } from 'src/configs/redis.config';
import { AccountsModule } from 'src/modules/account/account.module';
import { InstrumentModule } from 'src/modules/instrument/instrument.module';
import { OrderController } from 'src/modules/order/order.controller';
import { OrderService } from 'src/modules/order/order.service';
import { PositionModule } from 'src/modules/position/position.module';
import { UsersModule } from 'src/modules/user/users.module';
import { TradeModule } from '../trade/trade.module';
import * as redisStore from 'cache-manager-redis-store';
import { OrderConsole } from './order.console';
import { TradingRulesModule } from '../trading-rules/trading-rules.module';

@Module({
  imports: [
    Logger,
    AccountsModule,
    InstrumentModule,
    PositionModule,
    UsersModule,
    TradeModule,
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    TradingRulesModule,
  ],
  providers: [OrderService, Logger, OrderConsole],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
