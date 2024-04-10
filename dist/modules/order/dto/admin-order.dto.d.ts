import { ContractType, EDirection, EOrderBy, OrderSide } from 'src/shares/enums/order.enum';
export declare class AdminOrderDto {
    side: OrderSide;
    type: string;
    symbol: string;
    from: string;
    to: string;
    isActive: string;
    contractType: ContractType;
    orderBy: EOrderBy;
    direction: EDirection;
}
