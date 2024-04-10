"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseCommonModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_history_repository_1 = require("./repositories/account-history.repository");
const account_repository_1 = require("./repositories/account.repository");
const api_key_repository_1 = require("./repositories/api-key.repository");
const candles_repository_1 = require("./repositories/candles.repository");
const dex_action_history_repository_1 = require("./repositories/dex-action-history-repository");
const dex_action_sol_txs_repository_1 = require("./repositories/dex-action-sol-txs.repository");
const dex_action_transaction_repository_1 = require("./repositories/dex-action-transaction.repository");
const dex_action_repository_1 = require("./repositories/dex-action.repository");
const funding_history_repository_1 = require("./repositories/funding-history.repository");
const funding_repository_1 = require("./repositories/funding.repository");
const instrument_repository_1 = require("./repositories/instrument.repository");
const latest_block_repository_1 = require("./repositories/latest-block.repository");
const latest_signature_repository_1 = require("./repositories/latest-signature.repository");
const login_history_repository_1 = require("./repositories/login-history.repository");
const margin_history_repository_1 = require("./repositories/margin-history.repository");
const market_data_repository_1 = require("./repositories/market-data.repository");
const market_indices_repository_1 = require("./repositories/market-indices.repository");
const metadata_repository_1 = require("./repositories/metadata.repository");
const order_repository_1 = require("./repositories/order.repository");
const position_history_repository_1 = require("./repositories/position-history.repository");
const position_repository_1 = require("./repositories/position.repository");
const setting_repository_1 = require("./repositories/setting.repository");
const trade_repository_1 = require("./repositories/trade.repository");
const transaction_repository_1 = require("./repositories/transaction.repository");
const user_setting_repository_1 = require("./repositories/user-setting.repository");
const user_repository_1 = require("./repositories/user.repository");
const coin_info_repository_1 = require("./repositories/coin-info.repository");
const access_token_repository_1 = require("./repositories/access-token.repository");
const trading_rules_repository_1 = require("./repositories/trading-rules.repository");
const leverage_margin_repository_1 = require("./repositories/leverage-margin.repository");
const user_margin_mode_repository_1 = require("./repositories/user-margin-mode.repository");
const market_fee_repository_1 = require("./repositories/market_fee.repository");
const assets_repository_1 = require("./repositories/assets.repository");
const commonRepositories = [
    account_repository_1.AccountRepository,
    funding_repository_1.FundingRepository,
    instrument_repository_1.InstrumentRepository,
    login_history_repository_1.LoginHistoryRepository,
    leverage_margin_repository_1.LeverageMarginRepository,
    order_repository_1.OrderRepository,
    position_repository_1.PositionRepository,
    trade_repository_1.TradeRepository,
    setting_repository_1.SettingRepository,
    user_repository_1.UserRepository,
    market_data_repository_1.MarketDataRepository,
    market_indices_repository_1.MarketIndexRepository,
    transaction_repository_1.TransactionRepository,
    latest_block_repository_1.LatestBlockRepository,
    metadata_repository_1.MetadataRepository,
    candles_repository_1.CandlesRepository,
    margin_history_repository_1.MarginHistoryRepository,
    account_history_repository_1.AccountHistoryRepository,
    position_history_repository_1.PositionHistoryRepository,
    funding_history_repository_1.FundingHistoryRepository,
    user_setting_repository_1.UserSettingRepository,
    api_key_repository_1.ApiKeyRepository,
    dex_action_repository_1.DexActionRepository,
    dex_action_transaction_repository_1.DexActionTransactionRepository,
    dex_action_history_repository_1.DexActionHistoryRepository,
    dex_action_sol_txs_repository_1.DexActionSolTxRepository,
    latest_signature_repository_1.LatestSignatureRepository,
    coin_info_repository_1.CoinInfoRepository,
    access_token_repository_1.AccessTokenRepository,
    user_margin_mode_repository_1.UserMarginModeRepository,
    trading_rules_repository_1.TradingRulesRepository,
    market_fee_repository_1.MarketFeeRepository,
    assets_repository_1.AssetsRepository,
];
let DatabaseCommonModule = class DatabaseCommonModule {
};
DatabaseCommonModule = tslib_1.__decorate([
    common_1.Global(),
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature(commonRepositories, 'master'),
            typeorm_1.TypeOrmModule.forFeature(commonRepositories, 'report'),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseCommonModule);
exports.DatabaseCommonModule = DatabaseCommonModule;
//# sourceMappingURL=database-common.js.map