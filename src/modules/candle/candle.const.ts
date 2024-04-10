export const PREFIX_CACHE = 'candle';
export const CANDLE_TTL = 864000;
export const RESOLUTION_MINUTE = 60;
export const RESOLUTION_15MINUTES = 900;
export const RESOLUTION_HOUR = 3600;
export const KEY_CACHE_HEALTHCHECK_SYNC_CANDLE = 'healthcheck_sync_candle';

export interface Candle {
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
  time: number;
}
