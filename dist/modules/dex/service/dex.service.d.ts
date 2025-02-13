import { Logger } from '@nestjs/common';
import { Connection, InsertResult } from 'typeorm';
import { MarginHistoryRepository } from 'src/models/repositories/margin-history.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { CommandOutput } from 'src/modules/matching-engine/matching-engine.const';
import { DexActionRepository } from 'src/models/repositories/dex-action.repository';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { DexActionTransactionRepository } from 'src/models/repositories/dex-action-transaction.repository';
import { LatestBlockService } from 'src/modules/latest-block/latest-block.service';
import { DexActionHistoryRepository } from 'src/models/repositories/dex-action-history-repository';
import { FundingHistoryRepository } from 'src/models/repositories/funding-history.repository';
export declare class DexService {
    private readonly logger;
    private readonly latestBlockService;
    private masterConnection;
    private reportMarginHistoryRepo;
    readonly transactionRepoMaster: TransactionRepository;
    readonly reportTransactionRepo: TransactionRepository;
    private reportInstrumentRepo;
    readonly dexActionRepo: DexActionRepository;
    readonly reportDexActionRepo: DexActionRepository;
    readonly dexActionTransactionRepo: DexActionTransactionRepository;
    readonly reportDexActionTransactionRepo: DexActionTransactionRepository;
    readonly dexActionHistoryRepo: DexActionHistoryRepository;
    readonly reportDexActionHistoryRepo: DexActionHistoryRepository;
    private reportAccountRepo;
    private reportFundingHistoryRepo;
    private instrumentIds;
    private accountIdsToAddresses;
    private accountAddressesToIds;
    private accountIdsToUserIds;
    constructor(logger: Logger, latestBlockService: LatestBlockService, masterConnection: Connection, reportMarginHistoryRepo: MarginHistoryRepository, transactionRepoMaster: TransactionRepository, reportTransactionRepo: TransactionRepository, reportInstrumentRepo: InstrumentRepository, dexActionRepo: DexActionRepository, reportDexActionRepo: DexActionRepository, dexActionTransactionRepo: DexActionTransactionRepository, reportDexActionTransactionRepo: DexActionTransactionRepository, dexActionHistoryRepo: DexActionHistoryRepository, reportDexActionHistoryRepo: DexActionHistoryRepository, reportAccountRepo: AccountRepository, reportFundingHistoryRepo: FundingHistoryRepository);
    saveDexActions(offset: string, commands: CommandOutput[]): Promise<InsertResult | null>;
    private _fundingsToDexActions;
    private _withdrawalToDexAction;
    private _tradesToDexActions;
    handlePickDexActions(): Promise<void>;
    handleSendDexActions(): Promise<void>;
    _retrySentDexTxs(): Promise<void>;
    handleVerifyDexActions(): Promise<void>;
    handleHistoryDexActions(): Promise<unknown>;
    handleBalanceCheckerDexActions(): Promise<void>;
    private dexActionTypeToString;
    private _getInstrumentId;
    private _getAccountAddress;
    private _getAccountOwnerId;
    private _getAccountId;
}
