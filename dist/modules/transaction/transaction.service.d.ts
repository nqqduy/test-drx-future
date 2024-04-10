import { Logger } from '@nestjs/common';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { DexActionSolTxRepository } from 'src/models/repositories/dex-action-sol-txs.repository';
import { LatestSignatureRepository } from 'src/models/repositories/latest-signature.repository';
import { SettingRepository } from 'src/models/repositories/setting.repository';
import { TransactionRepository as TransactionEntityRepository } from 'src/models/repositories/transaction.repository';
import { AccountService } from 'src/modules/account/account.service';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { TransactionHistoryDto } from './dto/transaction.dto';
export declare class TransactionService {
    private readonly logger;
    private readonly kafkaClient;
    readonly transactionRepoMaster: TransactionEntityRepository;
    readonly transactionRepoReport: TransactionEntityRepository;
    readonly settingRepoReport: SettingRepository;
    private reportLatestSignatureRepo;
    private accountRepoMaster;
    private reportDexActionSolTxRepo;
    private readonly accountService;
    private readonly dexWrapper;
    private batchSize;
    constructor(logger: Logger, kafkaClient: KafkaClient, transactionRepoMaster: TransactionEntityRepository, transactionRepoReport: TransactionEntityRepository, settingRepoReport: SettingRepository, reportLatestSignatureRepo: LatestSignatureRepository, accountRepoMaster: AccountRepository, reportDexActionSolTxRepo: DexActionSolTxRepository, accountService: AccountService);
    findRecentDeposits(date: Date, fromId: number, count: number): Promise<TransactionEntity[]>;
    findPendingWithdrawals(fromId: number, count: number): Promise<TransactionEntity[]>;
    transactionHistory(userId: number, input: TransactionHistoryDto): Promise<{
        list: any[];
        count: number;
    }>;
    updateTransactions(): Promise<void>;
}
