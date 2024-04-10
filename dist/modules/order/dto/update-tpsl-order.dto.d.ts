import { OrderTrigger } from 'src/shares/enums/order.enum';
export declare class UpdateTpSlOrderDto {
    orderId: number;
    tpSLPrice: string;
    trigger: OrderTrigger;
}
