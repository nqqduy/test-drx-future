import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ContractType } from 'src/shares/enums/order.enum';
export declare class TransactionHistoryDto extends PaginationDto {
    startTime: string;
    endTime: string;
    asset: string;
    type: string;
    contractType: ContractType;
}
