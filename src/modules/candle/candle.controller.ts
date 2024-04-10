import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Candle } from 'src/modules/candle/candle.const';
import { CandleService } from 'src/modules/candle/candle.service';

@Controller('candle')
@ApiTags('Candle')
export class CandlesController {
  constructor(private readonly candleService: CandleService) {}

  @Get(':symbol/candles')
  @ApiOperation({
    description: 'Get candle data. From, to is timestamp of range time. Symbol get from /api/v1/ticker/24h',
  })
  get1m(
    @Param('symbol') symbol: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('resolution') resolution: string,
  ): Promise<Candle[]> {
    return this.candleService.getCandles(symbol, from, to, resolution);
  }
}
