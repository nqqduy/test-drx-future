export declare class BaseEmitter {
    private static instance;
    static getInstance(): BaseEmitter;
    emitTrades(): void;
    emitOrderbook(): void;
    emitOrders(): Promise<void>;
    emitUpdatedTrades(): Promise<void>;
}
