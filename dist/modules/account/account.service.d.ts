import { Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AccountHistoryEntity } from 'src/models/entities/account-history.entity';
import { AccountEntity } from 'src/models/entities/account.entity';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { AccountHistoryRepository } from 'src/models/repositories/account-history.repository';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { SettingRepository } from 'src/models/repositories/setting.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { WithdrawalDto } from 'src/modules/account/dto/body-withdraw.dto';
import { FromToDto } from 'src/shares/dtos/from-to.dto';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { Connection } from 'typeorm';
import { DepositDto } from './dto/body-deposit.dto';
export declare class AccountService {
    readonly accountRepoReport: AccountRepository;
    readonly accountRepoMaster: AccountRepository;
    readonly transactionRepoMaster: TransactionRepository;
    readonly accountHistoryRepoMaster: AccountHistoryRepository;
    readonly accountHistoryRepoReport: AccountHistoryRepository;
    readonly transactionRepoReport: TransactionRepository;
    readonly settingRepoReport: SettingRepository;
    private readonly kafkaClient;
    private cacheManager;
    private readonly logger;
    readonly positionRepositoryReport: PositionRepository;
    private connection;
    readonly userRepoReport: UserRepository;
    static DEFAULT_7DAY_MS: number;
    constructor(accountRepoReport: AccountRepository, accountRepoMaster: AccountRepository, transactionRepoMaster: TransactionRepository, accountHistoryRepoMaster: AccountHistoryRepository, accountHistoryRepoReport: AccountHistoryRepository, transactionRepoReport: TransactionRepository, settingRepoReport: SettingRepository, kafkaClient: KafkaClient, cacheManager: Cache, logger: Logger, positionRepositoryReport: PositionRepository, connection: Connection, userRepoReport: UserRepository);
    getFirstAccountByOwnerId(userId: number, asset?: string): Promise<AccountEntity>;
    withdraw(userId: number, withdrawalDto: WithdrawalDto): Promise<TransactionEntity>;
    findBatch(fromId: number, count: number): Promise<AccountEntity[]>;
    findBalanceFromTo(accountId: number, ft: FromToDto): Promise<AccountHistoryEntity[]>;
    saveUserDailyBalance(): Promise<void>;
    getTransferHistory(accountId: number, type: string, paging: PaginationDto): Promise<ResponseDto<TransactionEntity[]>>;
    getBalanceV2(userId: number, asset?: string): Promise<{
        balance: string;
    }>;
    deposit(userId: number, body: DepositDto): Promise<{
        success: boolean;
    }>;
    private sendTransactions;
    genInsuranceAccounts(): Promise<void>;
    genNewAssetAccounts(asset: string): Promise<void>;
    createNewAccount(userId: number, asset: string): Promise<AccountEntity>;
    syncEmail(): Promise<void>;
    depositUSDTBotAccount(): Promise<void>;
}
