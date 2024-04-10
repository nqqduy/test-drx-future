import { OrderService } from './order.service';
export declare class OrderConsole {
    private orderService;
    constructor(orderService: OrderService);
    insertCoinInfo(): Promise<void>;
    updateEmailOrder(): Promise<void>;
    enableOrDisableCreateOrder(text: string): Promise<void>;
}
