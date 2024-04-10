import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ContractType } from 'src/shares/enums/order.enum';

export class AdminPositionDto {
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
    example: 'BTCUSDT',
  })
  @IsString()
  @IsOptional()
  symbol: string;

  @ApiProperty({
    required: false,
    example: 'USD_M',
  })
  @IsString()
  @IsOptional()
  contractType: ContractType;
}
