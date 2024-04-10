import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ContractType } from 'src/shares/enums/order.enum';

export class CreateInstrumentDto {
  @ApiProperty()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsNotEmpty()
  rootSymbol: string;

  @ApiProperty()
  @IsNotEmpty()
  contractType: ContractType;

  @ApiProperty()
  @IsNotEmpty()
  underlyingSymbol: string;

  @ApiProperty()
  @IsNotEmpty()
  makerFee: string;

  @ApiProperty()
  @IsNotEmpty()
  takerFee: string;

  @ApiProperty()
  @IsNotEmpty()
  tickSize: string;

  @ApiProperty()
  @IsNotEmpty()
  maxPrice: string;

  @ApiProperty()
  @IsNotEmpty()
  minPriceMovement: string;

  @ApiProperty()
  @IsOptional()
  maxFiguresForSize: string;

  @ApiProperty()
  @IsNotEmpty()
  maxFiguresForPrice: string;

  @ApiProperty()
  @IsNotEmpty()
  impactMarginNotional: string;

  @ApiProperty()
  @IsOptional()
  multiplier: string;
}

export class CreateTradingRuleDto {
  @ApiProperty()
  @IsNotEmpty()
  minPrice: string;

  @ApiProperty()
  @IsNotEmpty()
  limitOrderPrice: string;

  @ApiProperty()
  @IsNotEmpty()
  floorRatio: string;

  @ApiProperty()
  @IsNotEmpty()
  minOrderAmount: string;

  @ApiProperty()
  @IsNotEmpty()
  maxOrderAmount: string;

  @ApiProperty()
  @IsNotEmpty()
  minNotional: string;

  @ApiProperty()
  @IsNotEmpty()
  maxNotinal: string;

  @ApiProperty()
  @IsNotEmpty()
  liqClearanceFee: string;

  @ApiProperty()
  @IsNotEmpty()
  maxLeverage: number;
}

export class CreateLeverageMarginDto {
  @ApiProperty()
  @IsNotEmpty()
  min: number;

  @ApiProperty()
  @IsNotEmpty()
  max: number;

  @ApiProperty()
  @IsNotEmpty()
  maxLeverage: number;

  @ApiProperty()
  @IsNotEmpty()
  maintenanceMarginRate: number;

  @ApiProperty()
  @IsNotEmpty()
  maintenanceAmount: number;

  @ApiProperty()
  @IsIn(Object.keys(ContractType))
  contractType: ContractType;
}

export class ContractDto {
  @ApiProperty()
  @IsNotEmpty()
  instrument: CreateInstrumentDto;

  @ApiProperty()
  @IsNotEmpty()
  tradingRules: CreateTradingRuleDto;

  @ApiProperty({
    example: [
      {
        min: 1,
        max: 1,
        maxLeverage: 1,
        maintenanceMarginRate: 1,
        maintenanceAmount: 1,
      },
    ],
  })
  @IsNotEmpty()
  leverageMargin: CreateLeverageMarginDto[];
}

export class ContractListDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsIn(Object.keys(ContractType))
  contractType: ContractType;
}

export class UpdateContractDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  symbol: string;
}
