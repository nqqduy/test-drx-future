import { Module } from '@nestjs/common';
import { DatabaseCommonModule } from 'src/models/database-common';
import { AccountsModule } from '../account/account.module';
import { UserMarginModeController } from './user-margin-mode.controller';
import { UserMarginModeService } from './user-margin-mode.service';

@Module({
  imports: [DatabaseCommonModule, AccountsModule],
  controllers: [UserMarginModeController],
  providers: [UserMarginModeService],
  exports: [UserMarginModeService],
})
export class UserMarginModeModule {}
