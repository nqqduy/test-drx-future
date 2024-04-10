import { ContractType, EDirection, EOrderBy, OrderSide } from 'src/shares/enums/order.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminOrderDto {
  @ApiProperty({
    required: false,
    example: 'BUY',
  })
  @IsString()
  @IsOptional()
  side: OrderSide;

  @ApiProperty({
    required: false,
    example: 'LIMIT',
  })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    required: false,
    example: 'BTCUSDT',
  })
  @IsString()
  @IsOptional()
  symbol: string;

  @ApiProperty({
    required: true,
    example: '2023-01-21',
  })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({
    required: true,
    example: '2023-02-21',
  })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({
    required: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  isActive: string;

  @ApiProperty({
    required: false,
    example: 'USD_M',
  })
  @IsString()
  @IsOptional()
  contractType: ContractType;

  @ApiProperty({
    required: false,
    example: EOrderBy.COST,
  })
  @IsEnum(EOrderBy)
  @IsOptional()
  orderBy: EOrderBy;

  @ApiProperty({
    required: false,
    example: EDirection.ASC,
  })
  @IsEnum(EDirection)
  @IsOptional()
  direction: EDirection;
}
