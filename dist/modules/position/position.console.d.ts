import { PositionService } from './position.service';
export declare class PositionConsole {
    private positionService;
    constructor(positionService: PositionService);
    updatePositions(): Promise<void>;
    closeAllPositionCommand(symbol?: string): Promise<void>;
    updateIdPositionCommand(): Promise<void>;
}
