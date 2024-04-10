export declare enum OrderSide {
    BUY = "BUY",
    SELL = "SELL"
}
export declare enum OrderType {
    LIMIT = "LIMIT",
    MARKET = "MARKET",
    STOP_LIMIT = "STOP_LIMIT",
    STOP_MARKET = "STOP_MARKET",
    TRAILING_STOP = "TRAILING_STOP",
    LIQUIDATION = "LIQUIDATION",
    TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
    STOP_LOSS_MARKET = "STOP_LOSS_MARKET"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    FILLED = "FILLED",
    CANCELED = "CANCELED",
    UNTRIGGERED = "UNTRIGGERED",
    REJECTED = "REJECTED",
    PARTIALLY_FILLED = "PARTIALLY_FILLED"
}
export declare enum TpSlType {
    TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
    TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
    STOP_LIMIT = "STOP_LIMIT",
    STOP_MARKET = "STOP_MARKET",
    TRAILING_STOP = "TRAILING_STOP"
}
export declare const OrderStopCondition: {
    GT: "GT";
    LT: "LT";
};
export declare const AssetOrder: {
    USD: "USD";
    USDT: "USDT";
    BTC: "BTC";
    ETH: "ETH";
    BNB: "BNB";
    LTC: "LTC";
    SOL: "SOL";
    ATOM: "ATOM";
    MATIC: "MATIC";
    UNI: "UNI";
    XRP: "XRP";
};
export declare enum OrderTimeInForce {
    GTC = "GTC",
    IOC = "IOC",
    FOK = "FOK"
}
export declare const OrderPairType: {
    [x: string]: string;
};
export declare enum OrderTrigger {
    LAST = "LAST",
    INDEX = "INDEX",
    ORACLE = "ORACLE"
}
export declare enum OrderNote {
    LIQUIDATION = "LIQUIDATION",
    INSURANCE_LIQUIDATION = "INSURANCE_LIQUIDATION",
    INSURANCE_FUNDING = "INSURANCE_FUNDING",
    REDUCE_ONLY_CANCELED = "REDUCE_ONLY_CANCELED"
}
export declare enum MarginMode {
    CROSS = "CROSS",
    ISOLATE = "ISOLATE"
}
export declare enum CANCEL_ORDER_TYPE {
    ALL = "ALL",
    LIMIT = "LIMIT",
    STOP = "STOP"
}
export declare enum ORDER_TPSL {
    TAKE_PROFIT = "TAKE_PROFIT",
    STOP_LOSS = "STOP_LOSS"
}
export declare enum ContractType {
    COIN_M = "COIN_M",
    USD_M = "USD_M",
    ALL = "ALL"
}
export declare enum NotificationErrorCode {
    E001 = "E001"
}
export declare enum EOrderBy {
    TIME = "time",
    SYMBOL = "symbol",
    SIDE = "side",
    QUANTITY = "quantity",
    PRICE = "price",
    LEVERAGE = "leverage",
    COST = "cost",
    FILLED = "filled",
    STOP_PRICE = "stop price",
    STATUS = "status",
    EMAIL = "email"
}
export declare enum EDirection {
    DESC = "DESC",
    ASC = "ASC"
}
