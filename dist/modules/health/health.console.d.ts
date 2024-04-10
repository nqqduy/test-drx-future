import { AccountHistoryRepository } from 'src/models/repositories/account-history.repository';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { DexActionHistoryRepository } from 'src/models/repositories/dex-action-history-repository';
import { DexActionSolTxRepository } from 'src/models/repositories/dex-action-sol-txs.repository';
import { DexActionTransactionRepository } from 'src/models/repositories/dex-action-transaction.repository';
import { DexActionRepository } from 'src/models/repositories/dex-action.repository';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { LatestBlockRepository } from 'src/models/repositories/latest-block.repository';
import { LatestSignatureRepository } from 'src/models/repositories/latest-signature.repository';
import { MarketIndexRepository } from 'src/models/repositories/market-indices.repository';
import { CandleService } from 'src/modules/candle/candle.service';
import { FundingService } from 'src/modules/funding/funding.service';
import { IndexService } from 'src/modules/index/index.service';
import { MailService } from 'src/modules/mail/mail.service';
export declare class HealthConsole {
    private readonly fundingService;
    private readonly indexService;
    readonly indexRepository: MarketIndexRepository;
    readonly instrumentRepository: InstrumentRepository;
    readonly latestBlockRepository: LatestBlockRepository;
    readonly latestSignatureRepository: LatestSignatureRepository;
    readonly accountHistoryRepository: AccountHistoryRepository;
    readonly accountRepository: AccountRepository;
    readonly dexActionRepository: DexActionRepository;
    readonly dexActionTransactionRepository: DexActionTransactionRepository;
    readonly dexActionHistoryRepository: DexActionHistoryRepository;
    readonly dexActionSolTxRepository: DexActionSolTxRepository;
    private readonly mailService;
    private readonly candleService;
    private readonly logger;
    private cloudWatchClient;
    private provider;
    private readonly dexWrapper;
    private sotadexAccount;
    constructor(fundingService: FundingService, indexService: IndexService, indexRepository: MarketIndexRepository, instrumentRepository: InstrumentRepository, latestBlockRepository: LatestBlockRepository, latestSignatureRepository: LatestSignatureRepository, accountHistoryRepository: AccountHistoryRepository, accountRepository: AccountRepository, dexActionRepository: DexActionRepository, dexActionTransactionRepository: DexActionTransactionRepository, dexActionHistoryRepository: DexActionHistoryRepository, dexActionSolTxRepository: DexActionSolTxRepository, mailService: MailService, candleService: CandleService);
    healthCheck(): Promise<void>;
    private putLatestBlockMetrics;
    private putLatestSignatureMetrics;
    private getSignatureId;
    private getLatestSignature;
    private putSignatureCrawlerMetric;
    private putIndexMetrics;
    private putFundingMetrics;
    private putAccountHistoryMetric;
    private putInsuranceFundMetric;
    private putEmailMetrics;
    private putDexActionMetric;
    private putDexActionTransactionMetric;
    private putDexActionHistoryMetric;
    private putCandleMetric;
    private putMetrics;
}
