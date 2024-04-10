import { TradesDto } from './dto/get-trades.dto';
import { AdminTradeDto } from './dto/admin-trade.dto';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { AccountService } from 'src/modules/account/account.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FillDto } from 'src/modules/trade/dto/get-fills.dto';
import { TradeService } from 'src/modules/trade/trade.service';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { TradeHistoryDto } from './dto/trade-history.dto';
import { JwtAdminGuard } from '../auth/guards/jwt.admin.guard';

@Controller('trade')
@ApiTags('Trade')
@ApiBearerAuth()
export class TradeController {
  constructor(private readonly tradeService: TradeService, private readonly accountService: AccountService) {}

  @Post('/fill')
  @UseGuards(JwtAuthGuard)
  async getFillTrade(
    @UserID() userId: number,
    @Query() paging: PaginationDto,
    @Body() tradeHistoryDto: TradeHistoryDto,
  ): Promise<ResponseDto<FillDto[]>> {
    const response = await this.tradeService.getFillTrade(userId, paging, tradeHistoryDto);
    return response;
  }

  @Get('/:symbol')
  @ApiParam({
    name: 'symbol',
    example: 'BTCUSD',
    required: true,
  })
  async getRecentTrades(
    @Param('symbol') symbol: string,
    @Query() paging: PaginationDto,
  ): Promise<ResponseDto<TradeEntity[]>> {
    return {
      data: await this.tradeService.getRecentTrades(symbol, paging),
    };
  }

  @Get()
  @UseGuards(JwtAdminGuard)
  async getTrades(@Query() paging: PaginationDto, @Query() queries: AdminTradeDto): Promise<ResponseDto<TradesDto[]>> {
    const trades = await this.tradeService.getTrades(paging, queries);

    return trades;
  }
}
