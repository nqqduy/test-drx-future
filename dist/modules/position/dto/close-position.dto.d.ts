import { ClosePositionType } from 'src/shares/enums/position.enum';
export declare class ClosePositionDto {
    positionId: number;
    quantity: number;
    type: ClosePositionType;
    limitPrice: string;
}
