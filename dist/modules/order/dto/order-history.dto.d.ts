import { ContractType, OrderSide, OrderStatus, OrderType } from 'src/shares/enums/order.enum';
export declare class OrderHistoryDto {
    startTime: number;
    endTime: number;
    side: OrderSide;
    type: OrderType;
    symbol: string;
    isActive: boolean;
    status: OrderStatus;
    contractType: ContractType;
}
