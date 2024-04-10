import { Logger, Module } from '@nestjs/common';
import { CandleModule } from 'src/modules/candle/candle.module';
import { FundingModule } from 'src/modules/funding/funding.module';
import { HealthConsole } from 'src/modules/health/health.console';
import { HealthController } from 'src/modules/health/health.controller';
import { HealthService } from 'src/modules/health/health.service';
import { IndexModule } from 'src/modules/index/index.module';
import { LatestBlockModule } from 'src/modules/latest-block/latest-block.module';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthConsole, Logger],
  imports: [FundingModule, IndexModule, LatestBlockModule, MailModule, CandleModule],
})
export class HealthModule {}
