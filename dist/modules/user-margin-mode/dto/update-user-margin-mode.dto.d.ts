import { MarginMode } from 'src/shares/enums/order.enum';
export declare class UpdateMarginModeDto {
    instrumentId: number;
    marginMode: MarginMode;
    leverage: string;
}
