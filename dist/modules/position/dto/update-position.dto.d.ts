import { OrderTrigger } from 'src/shares/enums/order.enum';
export declare class UpdatePositionDto {
    positionId: number;
    takeProfit: string;
    stopLoss: string;
    takeProfitTrigger: OrderTrigger;
    stopLossTrigger: OrderTrigger;
}
