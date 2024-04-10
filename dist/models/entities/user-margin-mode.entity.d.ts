import { MarginMode } from 'src/shares/enums/order.enum';
export declare class UserMarginModeEntity {
    id: number;
    userId: number;
    instrumentId: number;
    marginMode: MarginMode;
    leverage: string;
    createdAt: Date;
    updatedAt: Date;
}
