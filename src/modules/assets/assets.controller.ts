import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContractType } from 'src/shares/enums/order.enum';
import { AssetsService } from './assets.service';

@Controller('assets')
@ApiTags('Assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('/')
  async getAllAssets(@Query('contractType') contractType: ContractType) {
    return await this.assetsService.findAllAssets(contractType);
  }
}
