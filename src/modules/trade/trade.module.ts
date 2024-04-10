import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/modules/account/account.module';
import { TradeController } from 'src/modules/trade/trade.controller';
import { TradeService } from 'src/modules/trade/trade.service';
import TradeSeedCommand from './trade.console';

@Module({
  imports: [AccountsModule],
  controllers: [TradeController],
  providers: [TradeService, TradeSeedCommand],
  exports: [TradeService],
})
export class TradeModule {}
