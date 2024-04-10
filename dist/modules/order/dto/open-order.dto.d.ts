import { ContractType } from 'src/shares/enums/order.enum';
export declare class OpenOrderDto {
    side: string;
    type: string;
    symbol: string;
    contractType: ContractType;
    getAll: boolean;
}
