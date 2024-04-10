"use strict";
var HealthConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthConsole = void 0;
const tslib_1 = require("tslib");
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ethers_1 = require("ethers");
const nestjs_console_1 = require("nestjs-console");
const dex_config_1 = require("../../configs/dex.config");
const health_config_1 = require("../../configs/health.config");
const sol_dex_config_1 = require("../../configs/sol-dex.config");
const dex_action_sol_tx_entity_1 = require("../../models/entities/dex-action-sol-tx.entity");
const account_history_repository_1 = require("../../models/repositories/account-history.repository");
const account_repository_1 = require("../../models/repositories/account.repository");
const dex_action_history_repository_1 = require("../../models/repositories/dex-action-history-repository");
const dex_action_sol_txs_repository_1 = require("../../models/repositories/dex-action-sol-txs.repository");
const dex_action_transaction_repository_1 = require("../../models/repositories/dex-action-transaction.repository");
const dex_action_repository_1 = require("../../models/repositories/dex-action.repository");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const latest_block_repository_1 = require("../../models/repositories/latest-block.repository");
const latest_signature_repository_1 = require("../../models/repositories/latest-signature.repository");
const market_indices_repository_1 = require("../../models/repositories/market-indices.repository");
const candle_service_1 = require("../candle/candle.service");
const dex_constant_1 = require("../dex/dex.constant");
const funding_service_1 = require("../funding/funding.service");
const health_const_1 = require("./health.const");
const index_service_1 = require("../index/index.service");
const mail_service_1 = require("../mail/mail.service");
const sotadex_wrapper_1 = require("../../shares/helpers/sotadex-wrapper");
const utils_1 = require("../../shares/helpers/utils");
const typeorm_2 = require("typeorm");
const { dexId, dexProgram, finalizedConnection, usdcId } = sol_dex_config_1.SolDex;
let HealthConsole = HealthConsole_1 = class HealthConsole {
    constructor(fundingService, indexService, indexRepository, instrumentRepository, latestBlockRepository, latestSignatureRepository, accountHistoryRepository, accountRepository, dexActionRepository, dexActionTransactionRepository, dexActionHistoryRepository, dexActionSolTxRepository, mailService, candleService) {
        this.fundingService = fundingService;
        this.indexService = indexService;
        this.indexRepository = indexRepository;
        this.instrumentRepository = instrumentRepository;
        this.latestBlockRepository = latestBlockRepository;
        this.latestSignatureRepository = latestSignatureRepository;
        this.accountHistoryRepository = accountHistoryRepository;
        this.accountRepository = accountRepository;
        this.dexActionRepository = dexActionRepository;
        this.dexActionTransactionRepository = dexActionTransactionRepository;
        this.dexActionHistoryRepository = dexActionHistoryRepository;
        this.dexActionSolTxRepository = dexActionSolTxRepository;
        this.mailService = mailService;
        this.candleService = candleService;
        this.logger = new common_1.Logger(HealthConsole_1.name);
        this.cloudWatchClient = new client_cloudwatch_1.CloudWatchClient({});
        this.provider = new ethers_1.providers.JsonRpcProvider(health_config_1.Health.rpcHost);
        this.dexWrapper = new sotadex_wrapper_1.SotaDexWrapper(dexProgram, dexId, usdcId);
    }
    async healthCheck() {
        let startTime = Date.now();
        while (true) {
            startTime = Date.now();
            if (dex_config_1.Dex.runningChain === dex_constant_1.DexRunningChain.BSCSIDECHAIN) {
                await this.putLatestBlockMetrics();
            }
            else {
                await this.putLatestSignatureMetrics();
                await this.putSignatureCrawlerMetric();
            }
            await this.putIndexMetrics();
            await this.putFundingMetrics();
            await this.putAccountHistoryMetric();
            await this.putInsuranceFundMetric();
            await this.putEmailMetrics();
            await this.putDexActionMetric();
            await this.putDexActionTransactionMetric();
            await this.putDexActionHistoryMetric();
            await this.putCandleMetric();
            const sleepTime = startTime + health_const_1.HEALTH_INTERVAL - Date.now();
            if (sleepTime > 0) {
                await utils_1.sleep(sleepTime);
            }
        }
    }
    async putLatestBlockMetrics() {
        const keys = ['TransactionCrawler', 'dex-action-history'];
        const metricData = [];
        const blockNumber = await this.provider.getBlockNumber();
        for (const service of keys) {
            const latestBlock = await this.latestBlockRepository.findOne({ service });
            const serviceBlockNumber = (latestBlock === null || latestBlock === void 0 ? void 0 : latestBlock.blockNumber) || 0;
            const value = blockNumber - serviceBlockNumber;
            if (Math.abs(value) < 500) {
                metricData.push({
                    MetricName: service,
                    Unit: 'Count',
                    Value: value,
                });
            }
            else {
                this.logger.log(`Invalid value (${value}) for metric ${service}`);
            }
        }
        await this.putMetrics(metricData);
    }
    async putLatestSignatureMetrics() {
        const keys = ['TransactionCrawler', 'handleHistoryDexActions'];
        const metricData = [];
        const latestSignature = await this.getLatestSignature();
        const latestSignatureId = latestSignature ? Number(latestSignature.id) : 0;
        for (const service of keys) {
            const latestBlock = await this.latestSignatureRepository.findOne({ service });
            const serviceSignatureId = await this.getSignatureId((latestBlock === null || latestBlock === void 0 ? void 0 : latestBlock.signature) || '');
            const value = latestSignatureId - serviceSignatureId;
            if (Math.abs(value) < 500) {
                metricData.push({
                    MetricName: service,
                    Unit: 'Count',
                    Value: value,
                });
            }
            else {
                this.logger.log(`Invalid value (${value}) for metric ${service}`);
            }
        }
        await this.putMetrics(metricData);
    }
    async getSignatureId(signature) {
        const tx = await this.dexActionSolTxRepository.findOne({
            where: {
                txid: signature,
            },
        });
        return tx ? Number(tx.id) : 0;
    }
    async getLatestSignature() {
        return await this.dexActionSolTxRepository.findOne({
            order: {
                id: 'DESC',
            },
        });
    }
    async putSignatureCrawlerMetric() {
        if (!this.sotadexAccount) {
            const [sotadexAccount] = await this.dexWrapper.getSotadexAccount();
            this.sotadexAccount = sotadexAccount;
        }
        const options = { limit: 50 };
        const fetchedSignatures = await finalizedConnection.getSignaturesForAddress(this.sotadexAccount, options);
        const signatures = fetchedSignatures.map((s) => s.signature);
        const latestCrawledSignature = await this.getLatestSignature();
        let value = 0;
        if (signatures.length > 0) {
            value = signatures.indexOf(latestCrawledSignature.txid || '');
            if (value < 0) {
                value = 50;
            }
        }
        await this.putMetrics([
            {
                MetricName: 'SignatureCrawler',
                Unit: 'Count',
                Value: value,
            },
        ]);
    }
    async putIndexMetrics() {
        const metricData = [];
        const instrumentCount = await this.instrumentRepository.count();
        const indexUpdateCount = await this.indexService.getUpdateCount();
        metricData.push({
            MetricName: 'MissingIndexUpdateCount',
            Unit: 'Count',
            Value: instrumentCount - indexUpdateCount,
        });
        const lastUpdate = await this.indexService.getLastUpdate();
        const updateDelay = (Date.now() - lastUpdate) / 1000;
        if (updateDelay < 2000) {
            metricData.push({
                MetricName: 'IndexUpdateDelay',
                Unit: 'Seconds',
                Value: updateDelay,
            });
        }
        else {
            this.logger.log(`Invalid value (${updateDelay}) for metric IndexUpdateDelay`);
        }
        const updateError = await this.indexService.getUpdateError();
        metricData.push({
            MetricName: 'IndexUpdateError',
            Unit: 'Count',
            Value: updateError === 'true' ? 1 : 0,
        });
        await this.putMetrics(metricData);
    }
    async putFundingMetrics() {
        const metricData = [];
        const lastUpdate = await this.fundingService.getLastUpdate();
        const updateDelay = (Date.now() - lastUpdate) / 1000;
        if (updateDelay < 2000) {
            metricData.push({
                MetricName: 'FundingUpdateDelay',
                Unit: 'Seconds',
                Value: updateDelay,
            });
        }
        else {
            this.logger.log(`Invalid value (${updateDelay}) for metric FundingUpdateDelay`);
        }
        const lastPay = await this.fundingService.getLastPay();
        const payDelay = (Date.now() - lastPay) / 1000;
        if (payDelay < 20000) {
            metricData.push({
                MetricName: 'FundingPayDelay',
                Unit: 'Seconds',
                Value: payDelay,
            });
        }
        else {
            this.logger.log(`Invalid value (${payDelay}) for metric FundingPayDelay`);
        }
        await this.putMetrics(metricData);
    }
    async putAccountHistoryMetric() {
        const accountHistory = await this.accountHistoryRepository.findOne({
            order: {
                id: 'DESC',
            },
        });
        let value = 1;
        if (accountHistory) {
            const updateDelay = accountHistory.createdAt.getTime() - Date.now();
            if (updateDelay < 86400000 + 1800000) {
                value = 0;
            }
        }
        await this.putMetrics([
            {
                MetricName: 'AccountHistoryError',
                Unit: 'Count',
                Value: value,
            },
        ]);
    }
    async putInsuranceFundMetric() {
        await this.putMetrics([
            {
                MetricName: 'InsuranceFundBalance',
                Unit: 'Count',
            },
        ]);
    }
    async putEmailMetrics() {
        const { activeCount, failedCount, waitingCount } = await this.mailService.getQueueStats();
        const metricData = [
            {
                MetricName: 'EmailActiveCount',
                Unit: 'Count',
                Value: activeCount,
            },
            {
                MetricName: 'EmailFailedCount',
                Unit: 'Count',
                Value: failedCount,
            },
            {
                MetricName: 'EmailWaitingCount',
                Unit: 'Count',
                Value: waitingCount,
            },
        ];
        await this.putMetrics(metricData);
    }
    async putDexActionMetric() {
        const pendingCount = await this.dexActionRepository.count({
            where: {
                dexActionTransactionId: 0,
            },
        });
        await this.putMetrics([
            {
                MetricName: 'PendingDexAction',
                Unit: 'Count',
                Value: pendingCount,
            },
        ]);
    }
    async putDexActionTransactionMetric() {
        const pendingCount = await this.dexActionTransactionRepository.count({
            where: {
                status: typeorm_2.Not(typeorm_2.In([dex_constant_1.DexTransactionStatus.SUCCESS, 'DELETED'])),
            },
        });
        await this.putMetrics([
            {
                MetricName: 'PendingDexActionTransaction',
                Unit: 'Count',
                Value: pendingCount,
            },
        ]);
    }
    async putDexActionHistoryMetric() {
        const pendingCount = await this.dexActionHistoryRepository.count({
            where: {
                validStatus: typeorm_2.Not(typeorm_2.Equal(dex_constant_1.BalanceValidStatus.SUCCESS)),
            },
        });
        await this.putMetrics([
            {
                MetricName: 'PendingDexActionHistory',
                Unit: 'Count',
                Value: pendingCount,
            },
        ]);
    }
    async putCandleMetric() {
        const metricData = [];
        const lastUpdate = await this.candleService.getLastUpdate();
        const updateDelay = (Date.now() - lastUpdate) / 1000;
        if (updateDelay < 2000) {
            metricData.push({
                MetricName: 'CandleUpdateDelay',
                Unit: 'Seconds',
                Value: updateDelay,
            });
        }
        else {
            this.logger.log(`Invalid value (${updateDelay}) for metric CandleUpdateDelay`);
        }
        await this.putMetrics(metricData);
    }
    async putMetrics(metricData) {
        if (metricData.length === 0) {
            return;
        }
        const input = {
            Namespace: health_config_1.Health.namespace,
            MetricData: metricData,
        };
        const command = new client_cloudwatch_1.PutMetricDataCommand(input);
        await this.cloudWatchClient.send(command);
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'health:check',
        description: 'Put metrics to cloudwatch',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthConsole.prototype, "healthCheck", null);
HealthConsole = HealthConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(2, typeorm_1.InjectRepository(market_indices_repository_1.MarketIndexRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(latest_block_repository_1.LatestBlockRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(latest_signature_repository_1.LatestSignatureRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(account_history_repository_1.AccountHistoryRepository, 'report')),
    tslib_1.__param(7, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(8, typeorm_1.InjectRepository(dex_action_repository_1.DexActionRepository, 'report')),
    tslib_1.__param(9, typeorm_1.InjectRepository(dex_action_transaction_repository_1.DexActionTransactionRepository, 'report')),
    tslib_1.__param(10, typeorm_1.InjectRepository(dex_action_history_repository_1.DexActionHistoryRepository, 'report')),
    tslib_1.__param(11, typeorm_1.InjectRepository(dex_action_sol_txs_repository_1.DexActionSolTxRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [funding_service_1.FundingService,
        index_service_1.IndexService,
        market_indices_repository_1.MarketIndexRepository,
        instrument_repository_1.InstrumentRepository,
        latest_block_repository_1.LatestBlockRepository,
        latest_signature_repository_1.LatestSignatureRepository,
        account_history_repository_1.AccountHistoryRepository,
        account_repository_1.AccountRepository,
        dex_action_repository_1.DexActionRepository,
        dex_action_transaction_repository_1.DexActionTransactionRepository,
        dex_action_history_repository_1.DexActionHistoryRepository,
        dex_action_sol_txs_repository_1.DexActionSolTxRepository,
        mail_service_1.MailService,
        candle_service_1.CandleService])
], HealthConsole);
exports.HealthConsole = HealthConsole;
//# sourceMappingURL=health.console.js.map