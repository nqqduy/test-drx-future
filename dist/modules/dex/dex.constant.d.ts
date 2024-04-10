export declare enum ActionType {
    TRADE = "TRADE",
    FUNDING = "FUNDING",
    WITHDRAW = "WITHDRAW"
}
export declare enum DexTransactionStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    SUCCESS = "SUCCESS",
    REVERT = "REVERT"
}
export declare enum MatchAction {
    MATCHING_BUY = "MATCHING_BUY",
    MATCHING_SELL = "MATCHING_SELL",
    FUNDING = "FUNDING",
    WITHDRAW = "WITHDRAW"
}
export declare enum BalanceValidStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS"
}
export declare enum DexLiquidationSide {
    NONE = 0,
    BUY = 1,
    SELL = 2
}
export declare enum DexRunningChain {
    BSCSIDECHAIN = "bscsidechain",
    SOL = "sol"
}
