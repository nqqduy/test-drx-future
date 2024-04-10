"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDirection = exports.EOrderBy = exports.NotificationErrorCode = exports.ContractType = exports.ORDER_TPSL = exports.CANCEL_ORDER_TYPE = exports.MarginMode = exports.OrderNote = exports.OrderTrigger = exports.OrderPairType = exports.OrderTimeInForce = exports.AssetOrder = exports.OrderStopCondition = exports.TpSlType = exports.OrderStatus = exports.OrderType = exports.OrderSide = void 0;
const enumize_1 = require("./enumize");
var OrderSide;
(function (OrderSide) {
    OrderSide["BUY"] = "BUY";
    OrderSide["SELL"] = "SELL";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
var OrderType;
(function (OrderType) {
    OrderType["LIMIT"] = "LIMIT";
    OrderType["MARKET"] = "MARKET";
    OrderType["STOP_LIMIT"] = "STOP_LIMIT";
    OrderType["STOP_MARKET"] = "STOP_MARKET";
    OrderType["TRAILING_STOP"] = "TRAILING_STOP";
    OrderType["LIQUIDATION"] = "LIQUIDATION";
    OrderType["TAKE_PROFIT_MARKET"] = "TAKE_PROFIT_MARKET";
    OrderType["STOP_LOSS_MARKET"] = "STOP_LOSS_MARKET";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["ACTIVE"] = "ACTIVE";
    OrderStatus["FILLED"] = "FILLED";
    OrderStatus["CANCELED"] = "CANCELED";
    OrderStatus["UNTRIGGERED"] = "UNTRIGGERED";
    OrderStatus["REJECTED"] = "REJECTED";
    OrderStatus["PARTIALLY_FILLED"] = "PARTIALLY_FILLED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var TpSlType;
(function (TpSlType) {
    TpSlType["TAKE_PROFIT_LIMIT"] = "TAKE_PROFIT_LIMIT";
    TpSlType["TAKE_PROFIT_MARKET"] = "TAKE_PROFIT_MARKET";
    TpSlType["STOP_LIMIT"] = "STOP_LIMIT";
    TpSlType["STOP_MARKET"] = "STOP_MARKET";
    TpSlType["TRAILING_STOP"] = "TRAILING_STOP";
})(TpSlType = exports.TpSlType || (exports.TpSlType = {}));
exports.OrderStopCondition = enumize_1.enumize('GT', 'LT');
exports.AssetOrder = enumize_1.enumize('USD', 'USDT', 'BTC', 'ETH', 'BNB', 'LTC', 'SOL', 'ATOM', 'MATIC', 'UNI', 'XRP');
var OrderTimeInForce;
(function (OrderTimeInForce) {
    OrderTimeInForce["GTC"] = "GTC";
    OrderTimeInForce["IOC"] = "IOC";
    OrderTimeInForce["FOK"] = "FOK";
})(OrderTimeInForce = exports.OrderTimeInForce || (exports.OrderTimeInForce = {}));
exports.OrderPairType = enumize_1.enumize();
var OrderTrigger;
(function (OrderTrigger) {
    OrderTrigger["LAST"] = "LAST";
    OrderTrigger["INDEX"] = "INDEX";
    OrderTrigger["ORACLE"] = "ORACLE";
})(OrderTrigger = exports.OrderTrigger || (exports.OrderTrigger = {}));
var OrderNote;
(function (OrderNote) {
    OrderNote["LIQUIDATION"] = "LIQUIDATION";
    OrderNote["INSURANCE_LIQUIDATION"] = "INSURANCE_LIQUIDATION";
    OrderNote["INSURANCE_FUNDING"] = "INSURANCE_FUNDING";
    OrderNote["REDUCE_ONLY_CANCELED"] = "REDUCE_ONLY_CANCELED";
})(OrderNote = exports.OrderNote || (exports.OrderNote = {}));
var MarginMode;
(function (MarginMode) {
    MarginMode["CROSS"] = "CROSS";
    MarginMode["ISOLATE"] = "ISOLATE";
})(MarginMode = exports.MarginMode || (exports.MarginMode = {}));
var CANCEL_ORDER_TYPE;
(function (CANCEL_ORDER_TYPE) {
    CANCEL_ORDER_TYPE["ALL"] = "ALL";
    CANCEL_ORDER_TYPE["LIMIT"] = "LIMIT";
    CANCEL_ORDER_TYPE["STOP"] = "STOP";
})(CANCEL_ORDER_TYPE = exports.CANCEL_ORDER_TYPE || (exports.CANCEL_ORDER_TYPE = {}));
var ORDER_TPSL;
(function (ORDER_TPSL) {
    ORDER_TPSL["TAKE_PROFIT"] = "TAKE_PROFIT";
    ORDER_TPSL["STOP_LOSS"] = "STOP_LOSS";
})(ORDER_TPSL = exports.ORDER_TPSL || (exports.ORDER_TPSL = {}));
var ContractType;
(function (ContractType) {
    ContractType["COIN_M"] = "COIN_M";
    ContractType["USD_M"] = "USD_M";
    ContractType["ALL"] = "ALL";
})(ContractType = exports.ContractType || (exports.ContractType = {}));
var NotificationErrorCode;
(function (NotificationErrorCode) {
    NotificationErrorCode["E001"] = "E001";
})(NotificationErrorCode = exports.NotificationErrorCode || (exports.NotificationErrorCode = {}));
var EOrderBy;
(function (EOrderBy) {
    EOrderBy["TIME"] = "time";
    EOrderBy["SYMBOL"] = "symbol";
    EOrderBy["SIDE"] = "side";
    EOrderBy["QUANTITY"] = "quantity";
    EOrderBy["PRICE"] = "price";
    EOrderBy["LEVERAGE"] = "leverage";
    EOrderBy["COST"] = "cost";
    EOrderBy["FILLED"] = "filled";
    EOrderBy["STOP_PRICE"] = "stop price";
    EOrderBy["STATUS"] = "status";
    EOrderBy["EMAIL"] = "email";
})(EOrderBy = exports.EOrderBy || (exports.EOrderBy = {}));
var EDirection;
(function (EDirection) {
    EDirection["DESC"] = "DESC";
    EDirection["ASC"] = "ASC";
})(EDirection = exports.EDirection || (exports.EDirection = {}));
//# sourceMappingURL=order.enum.js.map