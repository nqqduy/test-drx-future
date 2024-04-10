import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Console, Command } from 'nestjs-console';
import { AccountEntity } from 'src/models/entities/account.entity';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { KafkaGroups, KafkaTopics } from 'src/shares/enums/kafka.enum';
import { ContractType } from 'src/shares/enums/order.enum';
import { TransactionStatus, TransactionType } from 'src/shares/enums/transaction.enum';
import { UserStatus } from 'src/shares/enums/user.enum';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { Connection } from 'typeorm';
import { CommandCode } from '../matching-engine/matching-engine.const';
import {
  ReferralOrReward,
  SyncAntiPhishingCode,
  SyncLocaleUser,
  SyncUser,
  SynNotificationToken,
} from './interface/spot.interface';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';

@Console()
@Injectable()
export class SpotConsole {
  private readonly logger = new Logger(SpotConsole.name);

  constructor(
    @InjectConnection('master') private connection: Connection,
    public readonly kafkaClient: KafkaClient,
    @InjectRepository(AccountRepository, 'report')
    public readonly accountRepoReport: AccountRepository,

    @InjectRepository(InstrumentRepository, 'report')
    public readonly instrumentRepoReport: InstrumentRepository,

    @InjectRepository(TransactionRepository, 'master')
    public readonly transactionRepoMaster: TransactionRepository,

    @InjectRepository(UserRepository, 'master') private usersRepositoryMaster: UserRepository,
    @InjectRepository(UserRepository, 'report') private usersRepositoryReport: UserRepository,
    @InjectRepository(AccountRepository, 'master') private accountRepoMaster: AccountRepository,
  ) {}

  @Command({
    command: 'future:referral_reward',
    description: 'Save balance from spot',
  })
  async saveBalanceFromRewardOrReferral(): Promise<void> {
    await this.kafkaClient.consume(
      KafkaTopics.future_reward_referral,
      KafkaGroups.future_reward_referral,
      async (data: ReferralOrReward) => {
        const account = await this.accountRepoReport.findOne({
          userId: data.userId,
          asset: data.asset.toUpperCase(),
        });
        if (!account) {
          console.log('Account not found');
          return;
        }
        const transaction = new TransactionEntity();
        transaction.accountId = account.id;
        transaction.amount = data.amount;
        transaction.status = TransactionStatus.PENDING;
        transaction.type = data.type;
        transaction.asset = data.asset.toUpperCase();
        transaction.userId = data.userId;
        await this.transactionRepoMaster.save(transaction);

        await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
          code: CommandCode.DEPOSIT,
          data: transaction,
        });
      },
    );
    return new Promise(() => {});
  }

  @Command({
    command: 'future:transfer',
    description: 'deposit to future',
  })
  async futureTransfer(): Promise<void> {
    await this.kafkaClient.consume(KafkaTopics.future_transfer, KafkaGroups.future_transfer, async (data: any) => {
      const account = await this.accountRepoReport.findOne({
        where: {
          userId: data.userId,
          asset: data.asset.toUpperCase(),
        },
      });
      if (!account) {
        console.log('transfer failed: ', account, data);

        return;
      }
      const transaction = new TransactionEntity();
      transaction.accountId = account.id;
      transaction.asset = data.asset.toUpperCase();
      transaction.amount = data.amount;
      transaction.status = TransactionStatus.PENDING;
      transaction.type = TransactionType.DEPOSIT;
      transaction.userId = data.userId;
      transaction.contractType = ContractType.USD_M;
      if (data.asset.toUpperCase() === 'USDT' || data.asset.toUpperCase() === 'USD') {
        transaction.contractType = ContractType.USD_M;
      } else {
        transaction.contractType = ContractType.COIN_M;
      }
      const transactionDb = await this.transactionRepoMaster.save(transaction);
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.DEPOSIT,
        data: transactionDb,
      });
    });
    return new Promise(() => {});
  }

  @Command({
    command: 'future:sync-user',
    description: 'sync user from spot',
  })
  async syncUser(): Promise<void> {
    await this.kafkaClient.consume(
      KafkaTopics.future_sync_user,
      KafkaGroups.future_sync_user,
      async (data: SyncUser) => {
        const checkUser = await this.usersRepositoryReport.findOne({
          where: [{ id: data.id }, { email: data.email }],
        });
        if (checkUser) {
          return;
        }
        // Create Transaction
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const [newUser, instruments] = await Promise.all([
            queryRunner.manager.getRepository(UserEntity).save({ ...data, status: UserStatus.DEACTIVE }),
            this.instrumentRepoReport.find({ select: ['symbol'] }),
          ]);
          const lstCoinSupport = [
            ...new Set(
              instruments
                .map((instrument) => instrument.symbol)
                .map((symbol) => {
                  if (symbol.includes('USDM')) {
                    return symbol.split('USDM')[0];
                  } else if (symbol.includes('USDT')) {
                    return 'USDT';
                  } else {
                    return 'USD';
                  }
                }),
            ),
          ];
          console.log({ lstCoinSupport });
          const accountToSave: AccountEntity[] = [];
          for (const asset of lstCoinSupport) {
            const newAccount: AccountEntity = new AccountEntity();
            newAccount.userId = newUser.id;
            newAccount.balance = '0';
            newAccount.asset = asset;
            newAccount.operationId = 0;
            newAccount.userEmail = data.email;
            accountToSave.push(newAccount);
          }

          const savedAccount = await queryRunner.manager.getRepository(AccountEntity).save(accountToSave);
          for (const account of savedAccount) {
            await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
              code: CommandCode.CREATE_ACCOUNT,
              data: account,
            });
          }

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
          console.log('SYNC USER FROM SPOT ' + error);
        } finally {
          await queryRunner.release();
        }
      },
    );
    return new Promise(() => {});
  }

  @Command({
    command: 'future:sync-anti-phishing-code',
    description: 'sync user from spot',
  })
  async syncAntiPhishingCode(): Promise<void> {
    await this.kafkaClient.consume(
      KafkaTopics.future_anti_phishing_code,
      KafkaGroups.future_anti_phishing_code,
      async (data: SyncAntiPhishingCode) => {
        const user = await this.usersRepositoryReport.findOne({
          where: [{ id: data.id }],
        });
        if (!user) {
          return;
        }
        user.antiPhishingCode = data.antiPhishingCode;
        await this.usersRepositoryMaster.save(user);
      },
    );
    return new Promise(() => {});
  }

  @Command({
    command: 'future:sync-locale-user',
    description: 'sync locale user',
  })
  async syncLocaleUser(): Promise<void> {
    await this.kafkaClient.consume(
      KafkaTopics.future_locale_user,
      KafkaGroups.future_locale_user,
      async (data: SyncLocaleUser) => {
        const user = await this.usersRepositoryReport.findOne({
          where: [{ id: data.id }],
        });
        if (!user) {
          return;
        }
        user.location = data.location;
        await this.usersRepositoryMaster.save(user);
      },
    );
    return new Promise(() => {});
  }

  @Command({
    command: 'future:sync-device-token',
    description: 'sync device token',
  })
  async syncDeviceToken(): Promise<void> {
    await this.kafkaClient.consume(
      KafkaTopics.future_device_token_user,
      KafkaGroups.future_device_token_user,
      async (data: SynNotificationToken) => {
        const user = await this.usersRepositoryReport.findOne({
          where: [{ id: data.userId }],
        });
        if (!user) {
          console.log("don't exist user", data.userId);
          return;
        }
        user.notification_token = data.deviceToken;
        await this.usersRepositoryMaster.save(user);
      },
    );
    return new Promise(() => {});
  }
}
