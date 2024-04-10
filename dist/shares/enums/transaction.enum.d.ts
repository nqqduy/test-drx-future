export declare const TransactionStatus: {
    PENDING: "PENDING";
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
};
export declare const TransactionType: {
    TRANSFER: "TRANSFER";
    DEPOSIT: "DEPOSIT";
    WITHDRAWAL: "WITHDRAWAL";
    TRADE: "TRADE";
    FUNDING_FEE: "FUNDING_FEE";
    TRADING_FEE: "TRADING_FEE";
    REALIZED_PNL: "REALIZED_PNL";
    LIQUIDATION_CLEARANCE: "LIQUIDATION_CLEARANCE";
    REFERRAL: "REFERRAL";
    REWARD: "REWARD";
};
export declare enum TransactionHistory {
    ONE_DAY = "ONE_DAY",
    ONE_WEEK = "ONE_WEEK",
    ONE_MONTH = "ONE_MONTH",
    THREE_MONTHS = "THREE_MONTHS"
}
export declare enum AssetType {
    BTC = "BTC",
    ETH = "ETH",
    BNB = "BNB",
    LTC = "LTC",
    XRP = "XRP",
    USDT = "USDT",
    SOL = "SOL",
    TRX = "TRX",
    MATIC = "MATIC",
    LINK = "LINK",
    MANA = "MANA",
    FIL = "FIL",
    ATOM = "ATOM",
    AAVE = "AAVE",
    DOGE = "DOGE",
    DOT = "DOT",
    UNI = "UNI",
    USD = "USD"
}
export declare enum SpotTransactionType {
    REFERRAL = "REFERRAL",
    REWARD = "REWARD"
}
