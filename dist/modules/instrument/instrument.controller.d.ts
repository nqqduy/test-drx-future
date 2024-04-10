import { InstrumentEntity } from 'src/models/entities/instrument.entity';
import { ContractDto, ContractListDto, UpdateContractDto } from 'src/modules/instrument/dto/create-instrument.dto';
import { UpdateInstrumentDto } from 'src/modules/instrument/dto/update-instrument.dto';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { GetInstrumentDto } from './dto/get-instrument.dto';
import { CreateMarketFeeDto } from './dto/create-market-free.dto';
import { MarketFeeEntity } from 'src/models/entities/market_fee.entity';
import { UpdateMarketFeeDto } from './dto/update-market-fee.dto';
export declare class InstrumentController {
    private readonly instrumentService;
    constructor(instrumentService: InstrumentService);
    getAllInstruments(query: GetInstrumentDto): Promise<ResponseDto<InstrumentEntity[]>>;
    getInstrumentsBySymbol(symbol: string): Promise<ResponseDto<InstrumentEntity>>;
    createInstrument(contractDto: ContractDto): Promise<{
        newInstrument: {
            name: string;
            symbol: string;
            quoteCurrency: string;
            contractSize: string;
            lotSize: string;
            maxOrderQty: number;
            rootSymbol: string;
            contractType: import("../../shares/enums/order.enum").ContractType;
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
        } & InstrumentEntity;
        newTradingRule: {
            symbol: string;
            minPrice: string;
            limitOrderPrice: string;
            floorRatio: string;
            minOrderAmount: string;
            maxOrderAmount: string;
            minNotional: string;
            maxNotinal: string;
            liqClearanceFee: string;
            maxLeverage: number;
        } & import("../../models/entities/trading_rules.entity").TradingRulesEntity;
        newLeverageMargin: ({
            symbol: string;
            min: number;
            max: number;
            maxLeverage: number;
            maintenanceMarginRate: number;
            maintenanceAmount: number;
            contractType: import("../../shares/enums/order.enum").ContractType;
        } & import("../../models/entities/leverage-margin.entity").LeverageMarginEntity)[];
    }>;
    getContractList(input: ContractListDto): Promise<{
        data: {
            list: any[];
            count: number;
        };
    }>;
    detailContract(underlyingSymbol: string): Promise<{
        data: {
            instrument: any;
            tradingTier: any[];
        };
    }>;
    updateContract(updateContractDto: UpdateContractDto): Promise<{
        data: import("typeorm").UpdateResult;
    }>;
    getInstrumentsById(id: number): Promise<ResponseDto<InstrumentEntity>>;
    updateInstrument(instrumentId: number, updateInstrumentDto: UpdateInstrumentDto): Promise<ResponseDto<InstrumentEntity>>;
    createMarketFeeByInstrument(createMarketFeeDto: CreateMarketFeeDto): Promise<ResponseDto<MarketFeeEntity>>;
    updateMarketFeeByInstrument(updateMarketFeeDto: UpdateMarketFeeDto): Promise<ResponseDto<MarketFeeEntity>>;
}
