import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { Cache } from 'cache-manager';
import { serialize } from 'class-transformer';
import { Producer } from 'kafkajs';

import { kafka } from 'src/configs/kafka';
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
import { CommandCode } from 'src/modules/matching-engine/matching-engine.const';
import { FromToDto } from 'src/shares/dtos/from-to.dto';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { AssetOrder, ContractType } from 'src/shares/enums/order.enum';
import { AssetType, TransactionStatus, TransactionType } from 'src/shares/enums/transaction.enum';
import { httpErrors } from 'src/shares/exceptions';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { Between, Connection, In } from 'typeorm';
import { MIN_TRANSFER_AMOUNT } from './account.const';
import { DepositDto } from './dto/body-deposit.dto';

@Injectable()
export class AccountService {
  static DEFAULT_7DAY_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(AccountRepository, 'report')
    public readonly accountRepoReport: AccountRepository,
    @InjectRepository(AccountRepository, 'master')
    public readonly accountRepoMaster: AccountRepository,
    @InjectRepository(TransactionRepository, 'master')
    public readonly transactionRepoMaster: TransactionRepository,
    @InjectRepository(AccountHistoryRepository, 'master')
    public readonly accountHistoryRepoMaster: AccountHistoryRepository,
    @InjectRepository(AccountHistoryRepository, 'report')
    public readonly accountHistoryRepoReport: AccountHistoryRepository,
    @InjectRepository(TransactionRepository, 'report')
    public readonly transactionRepoReport: TransactionRepository,
    @InjectRepository(SettingRepository, 'report')
    public readonly settingRepoReport: SettingRepository,
    private readonly kafkaClient: KafkaClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: Logger,
    @InjectRepository(PositionRepository, 'report')
    public readonly positionRepositoryReport: PositionRepository,
    @InjectConnection('report') private connection: Connection,
    @InjectRepository(UserRepository, 'report')
    public readonly userRepoReport: UserRepository,
  ) {}

  async getFirstAccountByOwnerId(userId: number, asset?: string): Promise<AccountEntity> {
    const account: AccountEntity = await this.accountRepoReport.findOne({
      where: { userId, asset },
    });
    if (!account) {
      throw new HttpException(httpErrors.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return account;
  }

  async withdraw(userId: number, withdrawalDto: WithdrawalDto): Promise<TransactionEntity> {
    // const account = await this.getFirstAccountByOwnerId(userId);
    if (new BigNumber(withdrawalDto.amount).comparedTo(MIN_TRANSFER_AMOUNT) == -1) {
      throw new BadRequestException('amount larger than 0.00000001');
    }
    const account = await this.accountRepoReport.findOne({
      where: {
        userId,
        asset: withdrawalDto.assetType,
      },
    });
    if (!account) {
      throw new HttpException(httpErrors.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const transaction = new TransactionEntity();
    transaction.accountId = account.id;
    transaction.amount = withdrawalDto.amount;
    transaction.status = TransactionStatus.PENDING;
    transaction.type = TransactionType.WITHDRAWAL;
    transaction.asset = withdrawalDto.assetType.toUpperCase();
    transaction.userId = userId;
    transaction.contractType = ContractType.USD_M;
    // const isCoinM = LIST_COINM.includes(withdrawalDto.assetType);
    if (withdrawalDto.assetType == 'USDT' || withdrawalDto.assetType == 'USD') {
      transaction.contractType = ContractType.USD_M;
    } else {
      transaction.contractType = ContractType.COIN_M;
    }

    const result = await this.transactionRepoMaster.save(transaction);

    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.WITHDRAW,
      data: transaction,
    });
    return result;
  }

  async findBatch(fromId: number, count: number): Promise<AccountEntity[]> {
    return await this.accountRepoMaster.findBatch(fromId, count);
  }

  async findBalanceFromTo(accountId: number, ft: FromToDto): Promise<AccountHistoryEntity[]> {
    if (!ft.from) ft.from = new Date().getTime() - AccountService.DEFAULT_7DAY_MS;
    if (!ft.to) ft.to = new Date().getTime();
    const accounts = await this.accountHistoryRepoReport.find({
      accountId: accountId,
      createdAt: Between<Date>(new Date(ft.from), new Date(ft.to)),
    });
    return accounts;
  }

  async saveUserDailyBalance(): Promise<void> {
    const today = new Date();
    // get all account info
    const allAccountHistories = await this.accountRepoReport.find();

    // mapping to history balance entity
    const todayUsersBalance = allAccountHistories.map((e) => {
      const newEntity = new AccountHistoryEntity();
      newEntity.accountId = e.id;
      // newEntity.balance = e.balance;
      newEntity.createdAt = today;
      return newEntity;
    });

    // batch insert into account history repo
    try {
      await this.accountHistoryRepoReport.batchSave(todayUsersBalance);
    } catch (error) {
      this.logger.error(`Failed to update daily balance at ${today}`);
    }
  }

  async getTransferHistory(
    accountId: number,
    type: string,
    paging: PaginationDto,
  ): Promise<ResponseDto<TransactionEntity[]>> {
    const where = {
      accountId: accountId,
    };
    if (type) {
      where['type'] = type;
    }
    const transfer = await this.transactionRepoReport.find({
      where,
      skip: (paging.page - 1) * paging.size,
      take: paging.size,
      order: {
        id: 'DESC',
      },
    });

    const count = await this.transactionRepoReport.count({
      where,
    });

    return {
      data: transfer,
      metadata: {
        totalPage: Math.ceil(count / paging.size),
      },
    };
  }

  async getBalanceV2(userId: number, asset = 'usdt') {
    const balance = await this.accountRepoReport.findOne({
      userId,
      asset,
    });

    return {
      balance: new BigNumber(balance.balance).toString(),
    };
  }

  async deposit(userId: number, body: DepositDto): Promise<{ success: boolean }> {
    const account = await this.accountRepoReport.findOne({
      where: {
        userId,
        asset: body.asset,
      },
    });
    if (!account) {
      throw new HttpException(httpErrors.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    //disable large amount
    // if (new BigNumber(body.amount).gt(1000000)) {
    //   return;
    // }

    const producer = kafka.producer();
    await producer.connect();

    const transaction = new TransactionEntity();
    transaction.accountId = account.id;
    // transaction.accountId = account?.id || -901;
    transaction.asset = body.asset.toUpperCase();
    transaction.amount = body.amount;
    transaction.status = TransactionStatus.PENDING;
    transaction.type = TransactionType.DEPOSIT;
    transaction.userId = userId;

    const transactionDb = await this.transactionRepoMaster.save(transaction);
    await this.sendTransactions(transactionDb, producer);
    await producer.disconnect();
    return { success: true };
  }

  private async sendTransactions(transaction: TransactionEntity, producer: Producer): Promise<void> {
    const messages = { value: serialize({ code: CommandCode.DEPOSIT, data: transaction }) };
    await producer.send({
      topic: KafkaTopics.matching_engine_input,
      messages: [messages],
    });
  }

  async genInsuranceAccounts(): Promise<void> {
    const assets = AssetOrder;
    for (const asset in assets) {
      const index = Object.keys(assets).indexOf(asset);
      await this.accountRepoMaster.insert({
        id: 1000 + index,
        asset: asset,
        balance: '100',
        operationId: 0,
      });
    }
  }

  async genNewAssetAccounts(asset: string): Promise<void> {
    if (!asset) {
      console.log('Asset can not be null');
      return;
    }
    const checkAccount = await this.accountRepoReport.findOne({
      where: {
        asset: asset.toUpperCase(),
      },
    });
    if (checkAccount) {
      console.log('Asset found');
      return;
    }
    const data = await this.accountRepoReport.createQueryBuilder('accounts').select('DISTINCT userId').execute();
    const userIds = data.map((e) => e.userId).filter((e) => e != '0');
    const taskInsert = [];
    const taskSendToKafka = [];
    for (const userId of userIds) {
      const account = new AccountEntity();
      account.asset = asset.toUpperCase();
      account.balance = '0';
      account.userId = userId;
      taskInsert.push(this.accountRepoMaster.insert(account));
      taskSendToKafka.push(
        this.kafkaClient.send(KafkaTopics.matching_engine_input, {
          code: CommandCode.CREATE_ACCOUNT,
          data: account,
        }),
      );
    }
    await Promise.all([...taskInsert, taskSendToKafka]);
  }

  async createNewAccount(userId: number, asset: string) {
    const isExistUser = await this.accountRepoReport.findOne({
      where: {
        userId: userId,
        asset: asset,
      },
    });
    if (isExistUser) {
      throw new HttpException(httpErrors.ACCOUNT_EXISTED, HttpStatus.NOT_FOUND);
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = new AccountEntity();
      account.asset = asset;
      account.balance = '1000000';
      account.userId = userId;
      await queryRunner.manager.save(AccountEntity, account);
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.CREATE_ACCOUNT,
        data: account,
      });
      await queryRunner.commitTransaction();
      return account;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('SYNC USER FROM SPOT ' + error);
    } finally {
      await queryRunner.release();
    }
  }

  async syncEmail(): Promise<void> {
    const users = await this.userRepoReport.find();
    for (const user of users) {
      await this.accountRepoMaster.update({ userId: user.id }, { userEmail: user.email });
    }
  }

  async depositUSDTBotAccount(): Promise<void> {
    const bots = await this.userRepoReport.find({ where: { position: 'bot' } });
    const botAccounts = await this.accountRepoReport.find({
      where: { userId: In(bots.map((bot) => bot.id)), asset: AssetType.USDT },
    });
    for (const account of botAccounts) {
      const producer = kafka.producer();
      await producer.connect();

      const transaction = new TransactionEntity();
      transaction.accountId = account.id;
      // transaction.accountId = account?.id || -901;
      transaction.asset = account.asset.toUpperCase();
      transaction.amount = '10000000';
      transaction.status = TransactionStatus.PENDING;
      transaction.type = TransactionType.DEPOSIT;
      transaction.userId = account.userId;
      const transactionDb = await this.transactionRepoMaster.save(transaction);
      await this.sendTransactions(transactionDb, producer);
      await producer.disconnect();
    }
  }
}
