import { OrderType, TpSlType } from 'src/shares/enums/order.enum';

export const CANCEL_STOP_TYPES = [
  OrderType.STOP_LIMIT,
  OrderType.STOP_MARKET,
  TpSlType.TRAILING_STOP,
  TpSlType.STOP_LIMIT,
  TpSlType.STOP_MARKET,
  TpSlType.TAKE_PROFIT_LIMIT,
  TpSlType.TAKE_PROFIT_MARKET,
];
export const ENABLE_CREATE_ORDER = 'enable_create_order';
export const CANCEL_LIMIT_TYPES = [OrderType.LIMIT];
