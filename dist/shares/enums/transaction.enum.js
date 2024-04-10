"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotTransactionType = exports.AssetType = exports.TransactionHistory = exports.TransactionType = exports.TransactionStatus = void 0;
const enumize_1 = require("./enumize");
exports.TransactionStatus = enumize_1.enumize('PENDING', 'APPROVED', 'REJECTED');
exports.TransactionType = enumize_1.enumize('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'TRADE', 'FUNDING_FEE', 'TRADING_FEE', 'REALIZED_PNL', 'LIQUIDATION_CLEARANCE', 'REFERRAL', 'REWARD');
var TransactionHistory;
(function (TransactionHistory) {
    TransactionHistory["ONE_DAY"] = "ONE_DAY";
    TransactionHistory["ONE_WEEK"] = "ONE_WEEK";
    TransactionHistory["ONE_MONTH"] = "ONE_MONTH";
    TransactionHistory["THREE_MONTHS"] = "THREE_MONTHS";
})(TransactionHistory = exports.TransactionHistory || (exports.TransactionHistory = {}));
var AssetType;
(function (AssetType) {
    AssetType["BTC"] = "BTC";
    AssetType["ETH"] = "ETH";
    AssetType["BNB"] = "BNB";
    AssetType["LTC"] = "LTC";
    AssetType["XRP"] = "XRP";
    AssetType["USDT"] = "USDT";
    AssetType["SOL"] = "SOL";
    AssetType["TRX"] = "TRX";
    AssetType["MATIC"] = "MATIC";
    AssetType["LINK"] = "LINK";
    AssetType["MANA"] = "MANA";
    AssetType["FIL"] = "FIL";
    AssetType["ATOM"] = "ATOM";
    AssetType["AAVE"] = "AAVE";
    AssetType["DOGE"] = "DOGE";
    AssetType["DOT"] = "DOT";
    AssetType["UNI"] = "UNI";
    AssetType["USD"] = "USD";
})(AssetType = exports.AssetType || (exports.AssetType = {}));
var SpotTransactionType;
(function (SpotTransactionType) {
    SpotTransactionType["REFERRAL"] = "REFERRAL";
    SpotTransactionType["REWARD"] = "REWARD";
})(SpotTransactionType = exports.SpotTransactionType || (exports.SpotTransactionType = {}));
//# sourceMappingURL=transaction.enum.js.map