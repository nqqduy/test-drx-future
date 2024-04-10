import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionHistoryDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
@ApiTags('transactions')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionnModeService: TransactionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTransactions(@UserID() userId: number, @Query() input: TransactionHistoryDto) {
    return {
      data: await this.transactionnModeService.transactionHistory(userId, input),
    };
  }
}
