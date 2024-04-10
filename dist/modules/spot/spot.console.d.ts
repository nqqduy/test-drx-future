import { AccountRepository } from 'src/models/repositories/account.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { Connection } from 'typeorm';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
export declare class SpotConsole {
    private connection;
    readonly kafkaClient: KafkaClient;
    readonly accountRepoReport: AccountRepository;
    readonly instrumentRepoReport: InstrumentRepository;
    readonly transactionRepoMaster: TransactionRepository;
    private usersRepositoryMaster;
    private usersRepositoryReport;
    private accountRepoMaster;
    private readonly logger;
    constructor(connection: Connection, kafkaClient: KafkaClient, accountRepoReport: AccountRepository, instrumentRepoReport: InstrumentRepository, transactionRepoMaster: TransactionRepository, usersRepositoryMaster: UserRepository, usersRepositoryReport: UserRepository, accountRepoMaster: AccountRepository);
    saveBalanceFromRewardOrReferral(): Promise<void>;
    futureTransfer(): Promise<void>;
    syncUser(): Promise<void>;
    syncAntiPhishingCode(): Promise<void>;
    syncLocaleUser(): Promise<void>;
    syncDeviceToken(): Promise<void>;
}
