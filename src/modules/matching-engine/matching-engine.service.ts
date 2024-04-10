/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import * as config from 'config';
import { Producer } from 'kafkajs';
import { MatchingEngineConfig } from 'src/configs/matching.config';
import { AccountEntity } from 'src/models/entities/account.entity';
import { FundingHistoryEntity } from 'src/models/entities/funding-history.entity';
import { MarginHistoryEntity } from 'src/models/entities/margin-history';
import { MIN_ORDER_ID, OrderEntity } from 'src/models/entities/order.entity';
import { PositionHistoryEntity } from 'src/models/entities/position-history.entity';
import { PositionEntity } from 'src/models/entities/position.entity';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { FundingHistoryRepository } from 'src/models/repositories/funding-history.repository';
import { FundingRepository } from 'src/models/repositories/funding.repository';
import { MarginHistoryRepository } from 'src/models/repositories/margin-history.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { PositionHistoryRepository } from 'src/models/repositories/position-history.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { TradeRepository } from 'src/models/repositories/trade.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { AccountService } from 'src/modules/account/account.service';
import { FundingService } from 'src/modules/funding/funding.service';
import { IndexService } from 'src/modules/index/index.service';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { BaseEngineService } from 'src/modules/matching-engine/base-engine.service';
import {
  convertDateFields,
  convertDateFieldsForOrders,
  convertFundingHistoriesDateFields,
} from 'src/modules/matching-engine/helper';

import {
  CommandCode,
  CommandOutput,
  FUNDING_HISTORY_TIMESTAMP_KEY,
  POSITION_HISTORY_TIMESTAMP_KEY,
  PREFIX_ASSET,
} from 'src/modules/matching-engine/matching-engine.const';
import { OrderService } from 'src/modules/order/order.service';
import { PositionService } from 'src/modules/position/position.service';
import { TradeService } from 'src/modules/trade/trade.service';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { OrderStatus } from 'src/shares/enums/order.enum';
import { TransactionStatus, TransactionType } from 'src/shares/enums/transaction.enum';
import { UserMarginModeRepository } from 'src/models/repositories/user-margin-mode.repository';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { LeverageMarginService } from '../leverage-margin/leverage-margin.service';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import BigNumber from 'bignumber.js';
import { TICKERS_LAST_PRICE_KEY } from '../ticker/ticker.const';
import { COINM } from '../instrument/instrument.const';
import { InstrumentTypes } from 'src/shares/enums/instrument.enum';
import { ADMIN_ID } from 'src/models/entities/user.entity';
@Injectable()
export class MatchingEngineService extends BaseEngineService {
  constructor(
    private readonly accountService: AccountService,
    private readonly fundingService: FundingService,
    private readonly indexService: IndexService,
    private readonly instrumentService: InstrumentService,
    private readonly orderService: OrderService,
    private readonly positionService: PositionService,
    private readonly tradeService: TradeService,
    private readonly transactionService: TransactionService,
    private readonly leverageMarginService: LeverageMarginService,
    private readonly kafkaClient: KafkaClient,
    @InjectRepository(AccountRepository, 'master')
    private accountRepository: AccountRepository,
    @InjectRepository(AccountRepository, 'report')
    private accountRepoReport: AccountRepository,
    @InjectRepository(InstrumentRepository, 'report')
    private instrumentRepoReport: InstrumentRepository,
    @InjectRepository(PositionRepository, 'master')
    private positionRepository: PositionRepository,
    @InjectRepository(OrderRepository, 'master')
    private orderRepository: OrderRepository,
    @InjectRepository(TradeRepository, 'master')
    private tradeRepository: TradeRepository,
    @InjectRepository(TransactionRepository, 'master')
    private transactionRepository: TransactionRepository,
    @InjectRepository(FundingRepository, 'master')
    private fundingRepoMaster: FundingRepository,
    @InjectRepository(FundingHistoryRepository, 'master')
    private fundingHistoryRepoMaster: FundingHistoryRepository,
    @InjectRepository(PositionHistoryRepository, 'master')
    private positionHistoryRepoMaster: PositionHistoryRepository,
    @InjectRepository(MarginHistoryRepository, 'master')
    private marginHistoryRepoMaster: MarginHistoryRepository,
    @InjectRepository(UserMarginModeRepository, 'master')
    private userMarginModeRepoMaster: UserMarginModeRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(TradingRulesRepository, 'report')
    private tradingRuleRepoReport: TradingRulesRepository,
  ) {
    super();
  }

  public async initializeEngine(producer: Producer): Promise<void> {
    const lastOrderId = await this.orderService.getLastOrderId();
    const lastPositionId = await this.positionService.getLastPositionId();
    const lastTradeId = await this.tradeService.getLastTradeId();
    const lastMarginHistoryId = await this.marginHistoryRepoMaster.getLastId();
    const lastPositionHistoryId = await this.positionHistoryRepoMaster.getLastId();
    const lastFundingHistoryId = await this.fundingHistoryRepoMaster.getLastId();
    const command = {
      code: CommandCode.INITIALIZE_ENGINE,
      data: {
        lastOrderId,
        lastPositionId,
        lastTradeId,
        lastMarginHistoryId,
        lastPositionHistoryId,
        lastFundingHistoryId,
      },
    };
    await producer.send({ topic: KafkaTopics.matching_engine_preload, messages: [{ value: JSON.stringify(command) }] });
  }

  public async loadInstruments(producer: Producer): Promise<void> {
    const instruments = await this.instrumentService.find();
    const task = [];
    for (const instrument of instruments) {
      task.push(
        this.cacheManager.set(
          `${PREFIX_ASSET}${instrument.symbol}`,
          instrument.contractType === InstrumentTypes.USD_M ? instrument.quoteCurrency : instrument.rootSymbol,
          { ttl: 0 },
        ),
      );
    }
    await Promise.all([
      task,
      this.sendData(producer, KafkaTopics.matching_engine_preload, CommandCode.UPDATE_INSTRUMENT, instruments),
    ]);
  }

  public async loadInstrumentExtras(producer: Producer): Promise<void> {
    const instruments = await this.instrumentService.find();
    const symbols = instruments.map((instrument) => instrument.symbol);
    const tickers: [] = await this.cacheManager.get(TICKERS_LAST_PRICE_KEY);

    const tickerObject =
      tickers !== null
        ? tickers.reduce((acc, { symbol, lastPrice }) => {
            acc[symbol] = lastPrice;
            return acc;
          }, {})
        : [];
    const [indexPrices, oraclePrices, fundingRates] = await Promise.all([
      this.indexService.getIndexPrices(symbols),
      this.indexService.getOraclePrices(symbols),
      this.fundingService.getFundingRates(symbols),
    ]);
    const instrumentExtras = [];
    for (const i in symbols) {
      instrumentExtras.push({
        symbol: symbols[i],
        oraclePrice: indexPrices[i],
        indexPrice: oraclePrices[i],
        fundingRate: fundingRates[i],
        lastPrice: tickerObject[`${symbols[i]}`] ? tickerObject[`${symbols[i]}`] : null,
      });
    }
    await this.sendData(
      producer,
      KafkaTopics.matching_engine_preload,
      CommandCode.UPDATE_INSTRUMENT_EXTRA,
      instrumentExtras,
    );
  }

  public async loadAccounts(producer: Producer): Promise<void> {
    const loader = async (fromId: number, size: number): Promise<AccountEntity[]> => {
      return await this.accountService.findBatch(fromId, size);
    };
    await this.loadData(producer, loader, CommandCode.CREATE_ACCOUNT, KafkaTopics.matching_engine_preload);
  }

  public async loadPositions(producer: Producer): Promise<void> {
    const loader = async (fromId: number, size: number): Promise<PositionEntity[]> => {
      return await this.positionService.findBatch(fromId, size);
    };
    await this.loadData(producer, loader, CommandCode.LOAD_POSITION, KafkaTopics.matching_engine_preload);
  }

  public async loadPositionHistories(producer: Producer): Promise<void> {
    const date = new Date(Date.now() - MatchingEngineConfig.positionHistoryTime);
    const positionHistory = await this.positionService.findHistoryBefore(date);
    const firstId = positionHistory?.id || 0;
    const loader = async (fromId: number, size: number): Promise<PositionHistoryEntity[]> => {
      return await this.positionService.findHistoryBatch(Math.max(firstId, fromId), size);
    };
    await this.loadData(producer, loader, CommandCode.LOAD_POSITION_HISTORY, KafkaTopics.matching_engine_preload);

    await this.savePositionHistoryTimestamp(date.getTime());
  }

  public async loadFundingHistories(producer: Producer): Promise<void> {
    const date = new Date(Date.now() - MatchingEngineConfig.fundingHistoryTime);
    const fundingHistory = await this.fundingService.findHistoryBefore(date);
    const firstId = fundingHistory?.id || 0;
    const loader = async (fromId: number, size: number): Promise<FundingHistoryEntity[]> => {
      return await this.fundingService.findHistoryBatch(Math.max(firstId, fromId), size);
    };
    await this.loadData(producer, loader, CommandCode.LOAD_FUNDING_HISTORY, KafkaTopics.matching_engine_preload);

    await this.saveFundingHistoryTimestamp(date.getTime());
  }

  public async loadOrders(producer: Producer): Promise<void> {
    await this.loadOrderByStatus(OrderStatus.ACTIVE, producer);
    await this.loadOrderByStatus(OrderStatus.UNTRIGGERED, producer);
    await this.loadOrderByStatus(OrderStatus.PENDING, producer);
  }

  async loadOrderByStatus(status: OrderStatus, producer: Producer): Promise<void> {
    const loader = async (fromId: number, size: number): Promise<OrderEntity[]> => {
      return await this.orderService.findOrderBatch(status, fromId, size);
    };
    await this.loadData(producer, loader, CommandCode.LOAD_ORDER, KafkaTopics.matching_engine_preload);
  }

  public async loadDeposits(producer: Producer): Promise<void> {
    const yesterday = new Date(Date.now() - 86400000);
    const loader = async (fromId: number, size: number): Promise<TransactionEntity[]> => {
      return await this.transactionService.findRecentDeposits(yesterday, fromId, size);
    };
    await this.loadData(producer, loader, CommandCode.DEPOSIT, KafkaTopics.matching_engine_preload);
  }

  public async loadWithdrawals(producer: Producer): Promise<void> {
    const loader = async (fromId: number, size: number): Promise<TransactionEntity[]> => {
      return await this.transactionService.findPendingWithdrawals(fromId, size);
    };
    await this.loadData(producer, loader, CommandCode.WITHDRAW, KafkaTopics.matching_engine_preload);
  }

  public async loadLeverageMargin(producer: Producer): Promise<void> {
    const leverageMargins = await this.leverageMarginService.findAll();
    await this.sendData(
      producer,
      KafkaTopics.matching_engine_preload,
      CommandCode.LOAD_LEVERAGE_MARGIN,
      leverageMargins,
    );
  }

  public async loadTradingRules(producer: Producer): Promise<void> {
    const tradingRules = await this.tradingRuleRepoReport.find();
    await this.sendData(producer, KafkaTopics.matching_engine_preload, CommandCode.LOAD_TRADING_RULE, tradingRules);
  }

  public async startEngine(producer: Producer): Promise<void> {
    const command = { code: CommandCode.START_ENGINE };
    await producer.send({ topic: KafkaTopics.matching_engine_preload, messages: [{ value: JSON.stringify(command) }] });
  }

  public async saveAccounts(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.accounts.length > 0) {
        entities.push(...command.accounts.map((item) => convertDateFields(new AccountEntity(), item)));
      }
    }

    await this.accountRepository.insertOrUpdate(entities);
  }

  public async savePositions(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.positions.length > 0) {
        entities.push(
          ...command.positions.map((item) => {
            delete item.orders;
            return convertDateFields(new PositionEntity(), item);
          }),
        );
      }
    }
    await this.positionRepository.insertOrUpdate(entities);
  }

  public async saveOrders(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.orders.length > 0) {
        entities.push(...command.orders.map((item) => convertDateFieldsForOrders(new OrderEntity(), item)));
      }
    }
    await this.orderRepository.insertOrUpdate(entities);
  }

  public async saveTrades(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.trades.length > 0) {
        entities.push(...command.trades.map((item) => convertDateFields(new TradeEntity(), item)));
      }
    }
    entities.forEach(async (entity) => {
      await Promise.all([
        this.transactionRepository.insert({
          symbol: entity.symbol,
          status: TransactionStatus.APPROVED,
          accountId: entity.buyAccountId,
          asset: entity.buyOrder.asset,
          type: TransactionType.TRADING_FEE,
          amount: entity.buyFee,
          userId: entity.buyUserId,
          contractType: entity.contractType,
        }),
        this.transactionRepository.insert({
          symbol: entity.symbol,
          status: TransactionStatus.APPROVED,
          accountId: entity.sellAccountId,
          asset: entity.sellOrder.asset,
          type: TransactionType.TRADING_FEE,
          amount: entity.sellFee,
          userId: entity.sellUserId,
          contractType: entity.contractType,
        }),
      ]);
      if (entity.realizedPnlOrderBuy) {
        await this.transactionRepository.insert({
          symbol: entity.symbol,
          status: TransactionStatus.APPROVED,
          accountId: entity.buyAccountId,
          asset: entity.sellOrder.asset,
          type: TransactionType.REALIZED_PNL,
          amount: entity.realizedPnlOrderBuy,
          userId: entity.buyUserId,
          contractType: entity.contractType,
        });
      }
      if (entity.realizedPnlOrderSell) {
        await this.transactionRepository.insert({
          symbol: entity.symbol,
          status: TransactionStatus.APPROVED,
          accountId: entity.sellAccountId,
          asset: entity.sellOrder.asset,
          type: TransactionType.REALIZED_PNL,
          amount: entity.realizedPnlOrderSell,
          userId: entity.sellUserId,
          contractType: entity.contractType,
        });
      }
      // const asset = await this.cacheManager.get(`${PREFIX_ASSET}${entity.symbol}`);
      let asset;
      if (entity.symbol.includes('USDM')) {
        asset = entity.symbol.split('USDM')[0];
      } else if (entity.symbol.includes('USDT')) {
        asset = 'USDT';
      } else {
        asset = 'USD';
      }
      console.log('Check asset: ', asset, entity);
      const [accountSell, accountBuy] = await Promise.all([
        this.accountRepoReport.findOne(entity.sellAccountId),
        this.accountRepoReport.findOne(entity.buyAccountId),
      ]);

      await this.kafkaClient.send(KafkaTopics.future_referral, {
        data: {
          buyerId: accountBuy.userId,
          sellerId: accountSell.userId,
          buyerFee: entity.buyFee,
          sellerFee: entity.sellFee,
          asset: asset?.toString().toLowerCase(),
        },
      });

      if (!entity.note && entity.contractType === InstrumentTypes.USD_M) {
        await Promise.all([
          this.kafkaClient.send(KafkaTopics.future_reward_center, {
            data: [
              {
                userId: accountSell.userId,
                volume: new BigNumber(entity.price).times(entity.quantity).toString(),
                symbol: entity.symbol,
              },
              {
                userId: accountBuy.userId,
                volume: new BigNumber(entity.price).times(entity.quantity).toString(),
                symbol: entity.symbol,
              },
            ],
          }),
        ]);
      }
    });
    await this.tradeRepository.insertOrUpdate(entities);
  }

  public async saveTransactions(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.transactions.length > 0) {
        entities.push(...command.transactions.map((item) => convertDateFields(new TransactionEntity(), item)));
      }
    }

    await this.transactionRepository.insertOrUpdate(entities);
    const acceptWithdrawEntities = entities.filter(
      (entity) => entity.status === TransactionStatus.APPROVED && entity.type === TransactionType.WITHDRAWAL,
    );
    if (acceptWithdrawEntities.length) {
      await Promise.all(
        acceptWithdrawEntities.map(async (entity) => {
          try {
            const { userId } = await this.accountRepoReport.findOne({
              where: {
                id: entity.accountId,
              },
            });
            await this.kafkaClient.send(KafkaTopics.spot_transfer, {
              userId: +userId,
              from: 'future',
              to: 'main',
              amount: +entity.amount,
              asset: `${entity.asset}`.toLowerCase(), // temple fixed
            });
          } catch (error) {
            console.log(error);
          }
        }),
      );
    }
  }

  public async savePositionHistories(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.positionHistories.length > 0) {
        entities.push(...command.positionHistories.map((item) => convertDateFields(new PositionHistoryEntity(), item)));
      }
    }

    await this.positionRepository.insertOrUpdate(entities);
  }

  public async saveFunding(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.fundingHistories.length > 0) {
        entities.push(
          ...command.fundingHistories.map((item) =>
            convertFundingHistoriesDateFields(new FundingHistoryEntity(), item),
          ),
        );
      }

      if (command.code === CommandCode.PAY_FUNDING && command.fundingHistories.length === 0) {
        const symbol = command.data['symbol'] as string;
        const time = new Date(command.data['time'] as string);
        await this.fundingRepoMaster.update({ symbol, time }, { paid: true });
      }
    }
    await this.fundingHistoryRepoMaster.insertOrUpdate(entities);

    entities.forEach(async (entity) => {
      await this.transactionRepository.insert({
        symbol: entity.symbol,
        status: TransactionStatus.APPROVED,
        accountId: entity.accountId,
        asset: entity.asset,
        type: TransactionType.FUNDING_FEE,
        amount: entity.amount,
        contractType: entity.contractType,
        userId: entity.userId,
      });
    });
  }

  public async saveMarginHistory(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.marginHistories.length > 0) {
        entities.push(...command.marginHistories.map((item) => convertDateFields(new MarginHistoryEntity(), item)));
      }
    }

    await this.marginHistoryRepoMaster.insertOrUpdate(entities);
  }

  public async saveMarginLeverage(commands: CommandOutput[]): Promise<void> {
    const entities = [];
    for (const command of commands) {
      if (command.adjustLeverage?.status === 'SUCCESS') {
        const { accountId, symbol, leverage, marginMode, id } = command.adjustLeverage;
        const [{ userId }, instrument] = await Promise.all([
          this.accountRepoReport.findOne(accountId),
          this.instrumentRepoReport.findOne({
            where: {
              symbol,
            },
          }),
        ]);
        entities.push({
          userId,
          instrumentId: instrument.id,
          marginMode,
          leverage,
          id: +id,
        });
      }
    }
    await Promise.all(
      entities.map((entity) => {
        if (entity.id) {
          const id = entity.id;
          delete entity.id;
          this.userMarginModeRepoMaster.update(id, entity);
        } else {
          entity.id = null;
          this.userMarginModeRepoMaster.insert(entity);
        }
      }),
    );
  }

  private async savePositionHistoryTimestamp(timestamp: number): Promise<void> {
    await this.cacheManager.set(POSITION_HISTORY_TIMESTAMP_KEY, timestamp, {
      ttl: Number.MAX_SAFE_INTEGER,
    });
  }

  private async saveFundingHistoryTimestamp(timestamp: number): Promise<void> {
    await this.cacheManager.set(FUNDING_HISTORY_TIMESTAMP_KEY, timestamp, {
      ttl: Number.MAX_SAFE_INTEGER,
    });
  }
}
