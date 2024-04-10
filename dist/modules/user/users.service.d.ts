import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { ApiKey } from 'src/models/entities/api-key.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { ApiKeyRepository } from 'src/models/repositories/api-key.repository';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { UserSettingRepository } from 'src/models/repositories/user-setting.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { FavoriteMarket } from 'src/modules/user/dto/favorite-market.dto';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { CoinInfoRepository } from 'src/models/repositories/coin-info.repository';
import { AccountEntity } from 'src/models/entities/account.entity';
export declare class UserService {
    private apiKeyRepository;
    private apiKeyReportRepository;
    private usersRepositoryMaster;
    private usersRepositoryReport;
    private userSettingRepository;
    readonly instrumentRepoReport: InstrumentRepository;
    readonly accountRepoReport: AccountRepository;
    readonly accountRepoMaster: AccountRepository;
    private readonly kafkaClient;
    private readonly mailService;
    private coinInfoRepository;
    private web3;
    constructor(apiKeyRepository: ApiKeyRepository, apiKeyReportRepository: ApiKeyRepository, usersRepositoryMaster: UserRepository, usersRepositoryReport: UserRepository, userSettingRepository: UserSettingRepository, instrumentRepoReport: InstrumentRepository, accountRepoReport: AccountRepository, accountRepoMaster: AccountRepository, kafkaClient: KafkaClient, mailService: MailerService, coinInfoRepository: CoinInfoRepository);
    checkUserIdExisted(id: number): Promise<boolean>;
    checkUserAddressExisted(address: string): Promise<boolean>;
    findUserById(id: number): Promise<UserEntity>;
    updateStatusUser(userId: number, status: string): Promise<void>;
    getUserByAccountId(accountId: number): Promise<UserEntity>;
    findUserByAddress(address: string): Promise<UserEntity>;
    createUser(body: CreateUserDto): Promise<UserEntity>;
    createUserWithoutChecking(address: string, transactionRepositoryUser?: Repository<UserEntity>, transactionRepositoryAccount?: Repository<AccountEntity>): Promise<UserEntity>;
    getUserFavoriteMarket(userId: number): Promise<FavoriteMarket[]>;
    updateUserFavoriteMarket(userId: number, symbol: string, isFavorite: boolean): Promise<{
        symbol: string;
        isFavorite: boolean;
    }>;
    checkEmailExist(email: string): Promise<{
        exist: boolean;
    }>;
    getUserByApiKey(key: string): Promise<{
        id: string;
    }>;
    listApiKey(address: string): Promise<ApiKey[]>;
    createApiKey(address: string): Promise<any>;
    deleteApiKey(apiKey: string): Promise<{
        apiKey: string;
    }>;
    getAntiPhishingCode(userId: number): Promise<string>;
    getAntiPhishingCodeByEmail(email: string): Promise<string>;
}
