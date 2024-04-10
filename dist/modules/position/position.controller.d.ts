import { AdminPositionDto } from './dto/admin-position.dto';
import { OrderEntity } from 'src/models/entities/order.entity';
import { PositionEntity } from 'src/models/entities/position.entity';
import { AccountService } from 'src/modules/account/account.service';
import { PositionService } from 'src/modules/position/position.service';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { ClosePositionDto } from './dto/close-position.dto';
import { RemoveTpSlDto } from './dto/RemoveTpSlDto';
import { UpdateMarginDto } from './dto/update-margin.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ContractType } from 'src/shares/enums/order.enum';
import { CloseAllPositionDto } from './dto/close-all-position.dto';
import { GetInforPositionDto } from './dto/get-info-position.dto';
export declare class PositionController {
    private readonly positionService;
    private readonly accountService;
    constructor(positionService: PositionService, accountService: AccountService);
    getAllPosition(userId: number, paging: PaginationDto, contractType: ContractType, symbol?: string): Promise<ResponseDto<PositionEntity[]>>;
    getAllPositionWithQty(userId: number, contractType: ContractType, symbol?: string): Promise<ResponseDto<PositionEntity[]>>;
    getAllPositionAdmin(paging: PaginationDto, queries: AdminPositionDto): Promise<ResponseDto<PositionEntity[]>>;
    getAverageIndexPrice(symbol: string): Promise<{
        data: {
            averageIndexPrice: string;
            history: import("../../models/entities/market-data.entity").MarketDataEntity[];
        };
    }>;
    getInforPosition(userId: number, query: GetInforPositionDto): Promise<{
        data: any[];
    }>;
    getPositionByAccountIdBySymbol(symbol: string, userId: number): Promise<ResponseDto<PositionEntity>>;
    updateMargin(userId: number, updateMarginDto: UpdateMarginDto): Promise<{
        data: boolean;
    }>;
    closePosition(userId: number, body: ClosePositionDto): Promise<ResponseDto<OrderEntity>>;
    closeAllPosition(userId: number, body: CloseAllPositionDto): Promise<ResponseDto<boolean>>;
    updatePosition(userId: number, updatePositionDto: UpdatePositionDto): Promise<{
        data: void;
    }>;
    removeTpSlPosition(userId: number, removeTpSlDto: RemoveTpSlDto): Promise<{
        data: void;
    }>;
    getTpSlOrderPosition(userId: number, positionId: number): Promise<{
        data: OrderEntity[];
    }>;
}
