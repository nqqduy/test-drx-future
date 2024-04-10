export declare const CommandCode: {
    DEPOSIT: "DEPOSIT";
    INITIALIZE_ENGINE: "INITIALIZE_ENGINE";
    START_ENGINE: "START_ENGINE";
    UPDATE_INSTRUMENT: "UPDATE_INSTRUMENT";
    UPDATE_INSTRUMENT_EXTRA: "UPDATE_INSTRUMENT_EXTRA";
    CREATE_ACCOUNT: "CREATE_ACCOUNT";
    LOAD_POSITION: "LOAD_POSITION";
    LOAD_POSITION_HISTORY: "LOAD_POSITION_HISTORY";
    LOAD_FUNDING_HISTORY: "LOAD_FUNDING_HISTORY";
    LOAD_ORDER: "LOAD_ORDER";
    WITHDRAW: "WITHDRAW";
    LIQUIDATE: "LIQUIDATE";
    PAY_FUNDING: "PAY_FUNDING";
    PLACE_ORDER: "PLACE_ORDER";
    CANCEL_ORDER: "CANCEL_ORDER";
    TRIGGER_ORDER: "TRIGGER_ORDER";
    DUMP: "DUMP";
    ADJUST_MARGIN_POSITION: "ADJUST_MARGIN_POSITION";
    ADJUST_LEVERAGE: "ADJUST_LEVERAGE";
    ADJUST_TP_SL: "ADJUST_TP_SL";
    LOAD_LEVERAGE_MARGIN: "LOAD_LEVERAGE_MARGIN";
    LOAD_TRADING_RULE: "LOAD_TRADING_RULE";
    ADJUST_TP_SL_PRICE: "ADJUST_TP_SL_PRICE";
    CLOSE_INSURANCE: "CLOSE_INSURANCE";
    MAIL_FUNDING: "MAIL_FUNDING";
};
export declare const ActionAdjustTpSl: {
    PLACE: "PLACE";
    CANCEL: "CANCEL";
};
export declare const Coin: {
    USD: "USD";
    USDT: "USDT";
};
export declare const NotificationEvent: {
    OrderPlaced: "OrderPlaced";
    OrderCanceled: "OrderCanceled";
    OrderMatched: "OrderMatched";
    OrderTriggered: "OrderTriggered";
    PositionLiquidated: "PositionLiquidated";
    WithdrawSubmitted: "WithdrawSubmitted";
    WithdrawUnsuccessfully: "WithdrawUnsuccessfully";
    WithdrawSuccessfully: "WithdrawSuccessfully";
    DepositSuccessfully: "DepositSuccessfully";
};
export declare const NotificationType: {
    success: "success";
    error: "error";
};
export declare const BATCH_SIZE = 5000;
export interface CommandOutput {
    code: string;
    data: Record<string, unknown>;
    accounts: Record<string, unknown>[];
    positions: Record<string, unknown>[];
    orders: Record<string, unknown>[];
    trades: Record<string, unknown>[];
    transactions: Record<string, unknown>[];
    marginHistories: Record<string, unknown>[];
    positionHistories: Record<string, unknown>[];
    fundingHistories: Record<string, unknown>[];
    errors: Record<string, unknown>[];
    liquidatedPositions: Record<string, unknown>[];
    adjustLeverage: Record<string, unknown>;
}
export interface Notification {
    event: string;
    type: string;
    userId: number;
    title: string;
    message: string;
    amount?: string;
    asset?: string;
    code?: string;
    orderType?: string;
    tpSlType?: string;
    isHidden?: boolean;
    side?: string;
    status?: string;
    quantity?: string;
    remaining?: string;
    contractType?: string;
}
export declare const POSITION_HISTORY_TIMESTAMP_KEY = "matching_engine_position_history_timestamp";
export declare const FUNDING_HISTORY_TIMESTAMP_KEY = "matching_engine_funding_history_timestamp";
export declare const FUNDING_INTERVAL = "8";
export declare const PREFIX_ASSET = "PREFIX_ASSET_";
export declare const handleTimeout: (fn: any) => Promise<void>;
export declare const sleep: (milliseconds: number) => Promise<unknown>;
export declare enum NOTIFICATION_TYPE {
    TP_SL_ORDER_TRIGGER = "TP_SL_ORDER_TRIGGER",
    FUNDING_FEE = "FUNDING_FEE"
}
export declare const NOTIFICATION_MESSAGE: Map<string, string>;
export declare enum LANGUAGE {
    ENGLISH = "EN",
    VIETNAMESE = "VI",
    KOREAN = "KR"
}
