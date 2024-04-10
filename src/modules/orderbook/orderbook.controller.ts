import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Orderbook } from 'src/modules/orderbook/orderbook.const';
import { OrderbookService } from 'src/modules/orderbook/orderbook.service';

@Controller('orderbook')
@ApiTags('Orderbook')
export class OrderbookController {
  constructor(private readonly orderbookService: OrderbookService) {}

  @Get('/:symbol')
  get(@Param('symbol') symbol: string): Promise<Orderbook> {
    return this.orderbookService.getOrderbook(symbol);
  }
}
