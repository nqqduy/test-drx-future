"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexRunningChain = exports.DexLiquidationSide = exports.BalanceValidStatus = exports.MatchAction = exports.DexTransactionStatus = exports.ActionType = void 0;
var ActionType;
(function (ActionType) {
    ActionType["TRADE"] = "TRADE";
    ActionType["FUNDING"] = "FUNDING";
    ActionType["WITHDRAW"] = "WITHDRAW";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var DexTransactionStatus;
(function (DexTransactionStatus) {
    DexTransactionStatus["PENDING"] = "PENDING";
    DexTransactionStatus["SENT"] = "SENT";
    DexTransactionStatus["SUCCESS"] = "SUCCESS";
    DexTransactionStatus["REVERT"] = "REVERT";
})(DexTransactionStatus = exports.DexTransactionStatus || (exports.DexTransactionStatus = {}));
var MatchAction;
(function (MatchAction) {
    MatchAction["MATCHING_BUY"] = "MATCHING_BUY";
    MatchAction["MATCHING_SELL"] = "MATCHING_SELL";
    MatchAction["FUNDING"] = "FUNDING";
    MatchAction["WITHDRAW"] = "WITHDRAW";
})(MatchAction = exports.MatchAction || (exports.MatchAction = {}));
var BalanceValidStatus;
(function (BalanceValidStatus) {
    BalanceValidStatus["PENDING"] = "PENDING";
    BalanceValidStatus["SUCCESS"] = "SUCCESS";
})(BalanceValidStatus = exports.BalanceValidStatus || (exports.BalanceValidStatus = {}));
var DexLiquidationSide;
(function (DexLiquidationSide) {
    DexLiquidationSide[DexLiquidationSide["NONE"] = 0] = "NONE";
    DexLiquidationSide[DexLiquidationSide["BUY"] = 1] = "BUY";
    DexLiquidationSide[DexLiquidationSide["SELL"] = 2] = "SELL";
})(DexLiquidationSide = exports.DexLiquidationSide || (exports.DexLiquidationSide = {}));
var DexRunningChain;
(function (DexRunningChain) {
    DexRunningChain["BSCSIDECHAIN"] = "bscsidechain";
    DexRunningChain["SOL"] = "sol";
})(DexRunningChain = exports.DexRunningChain || (exports.DexRunningChain = {}));
//# sourceMappingURL=dex.constant.js.map