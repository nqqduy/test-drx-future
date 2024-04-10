export declare const PREFIX_CACHE = "candle";
export declare const CANDLE_TTL = 864000;
export declare const RESOLUTION_MINUTE = 60;
export declare const RESOLUTION_15MINUTES = 900;
export declare const RESOLUTION_HOUR = 3600;
export declare const KEY_CACHE_HEALTHCHECK_SYNC_CANDLE = "healthcheck_sync_candle";
export interface Candle {
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
    time: number;
}
