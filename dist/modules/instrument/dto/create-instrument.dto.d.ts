import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ContractType } from 'src/shares/enums/order.enum';
export declare class CreateInstrumentDto {
    symbol: string;
    rootSymbol: string;
    contractType: ContractType;
    underlyingSymbol: string;
    makerFee: string;
    takerFee: string;
    tickSize: string;
    maxPrice: string;
    minPriceMovement: string;
    maxFiguresForSize: string;
    maxFiguresForPrice: string;
    impactMarginNotional: string;
    multiplier: string;
}
export declare class CreateTradingRuleDto {
    minPrice: string;
    limitOrderPrice: string;
    floorRatio: string;
    minOrderAmount: string;
    maxOrderAmount: string;
    minNotional: string;
    maxNotinal: string;
    liqClearanceFee: string;
    maxLeverage: number;
}
export declare class CreateLeverageMarginDto {
    min: number;
    max: number;
    maxLeverage: number;
    maintenanceMarginRate: number;
    maintenanceAmount: number;
    contractType: ContractType;
}
export declare class ContractDto {
    instrument: CreateInstrumentDto;
    tradingRules: CreateTradingRuleDto;
    leverageMargin: CreateLeverageMarginDto[];
}
export declare class ContractListDto extends PaginationDto {
    search: string;
    contractType: ContractType;
}
export declare class UpdateContractDto {
    id: number;
    symbol: string;
}
