import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { IndexService } from './index.service';

@Controller('index')
@ApiTags('Fake price')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get('/fake-mark-price')
  @ApiQuery({
    name: 'markPrice',
    example: 100,
    required: true,
  })
  @ApiQuery({
    name: 'symbol',
    example: 'UNIUSD',
    required: true,
  })
  async fakeMarkPrice(@Query('markPrice') markPrice: number, @Query('symbol') symbol: string) {
    return await this.indexService.fakeMarkPrice(markPrice, symbol);
  }
}
