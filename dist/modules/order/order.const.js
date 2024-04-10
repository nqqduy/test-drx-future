"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CANCEL_LIMIT_TYPES = exports.ENABLE_CREATE_ORDER = exports.CANCEL_STOP_TYPES = void 0;
const order_enum_1 = require("../../shares/enums/order.enum");
exports.CANCEL_STOP_TYPES = [
    order_enum_1.OrderType.STOP_LIMIT,
    order_enum_1.OrderType.STOP_MARKET,
    order_enum_1.TpSlType.TRAILING_STOP,
    order_enum_1.TpSlType.STOP_LIMIT,
    order_enum_1.TpSlType.STOP_MARKET,
    order_enum_1.TpSlType.TAKE_PROFIT_LIMIT,
    order_enum_1.TpSlType.TAKE_PROFIT_MARKET,
];
exports.ENABLE_CREATE_ORDER = 'enable_create_order';
exports.CANCEL_LIMIT_TYPES = [order_enum_1.OrderType.LIMIT];
//# sourceMappingURL=order.const.js.map