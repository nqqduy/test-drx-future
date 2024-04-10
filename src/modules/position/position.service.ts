import { MAX_RESULT_COUNT } from 'src/modules/trade/trade.const';
import { getQueryLimit } from 'src/shares/pagination-util';
import { AdminPositionDto } from './dto/admin-position.dto';
import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { Cache } from 'cache-manager';
import { PositionHistoryEntity } from 'src/models/entities/position-history.entity';
import { PositionEntity } from 'src/models/entities/position.entity';
import { PositionHistoryRepository } from 'src/models/repositories/position-history.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { httpErrors } from 'src/shares/exceptions';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { Not, Like, In } from 'typeorm';
import { AccountService } from '../account/account.service';
import { UpdateMarginDto } from './dto/update-margin.dto';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import { ActionAdjustTpSl, CommandCode } from 'src/modules/matching-engine/matching-engine.const';
import { plainToClass } from 'class-transformer';
import { ClosePositionDto } from './dto/close-position.dto';
import { ClosePositionType } from 'src/shares/enums/position.enum';
import { OrderRepository } from 'src/models/repositories/order.repository';
import {
  OrderSide,
  OrderTimeInForce,
  OrderType,
  OrderStatus,
  MarginMode,
  TpSlType,
  OrderStopCondition,
  ContractType,
} from 'src/shares/enums/order.enum';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { UserMarginModeRepository } from 'src/models/repositories/user-margin-mode.repository';
import { BaseEngineService } from '../matching-engine/base-engine.service';
import { MIN_ORDER_ID, OrderEntity } from 'src/models/entities/order.entity';
import { UpdatePositionDto } from './dto/update-position.dto';
import { TakeProfitStopLossOrder } from '../order/tp-sl.type';
import { RemoveTpSlDto } from './dto/RemoveTpSlDto';
import * as moment from 'moment';
import { INDEX_PRICE_PREFIX, ORACLE_PRICE_PREFIX } from '../index/index.const';
import { InstrumentService } from '../instrument/instrument.service';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
import { MAX_PRICE, MIN_PRICE } from '../trading-rules/trading-rules.constants';

import { RedisService } from 'nestjs-redis';
import { PREVIOUS_TIME } from './position.const';

import { UserRepository } from 'src/models/repositories/user.repository';
import { MarketDataRepository } from 'src/models/repositories/market-data.repository';
import { FundingHistoryRepository } from 'src/models/repositories/funding-history.repository';
import { MarginHistoryRepository } from 'src/models/repositories/margin-history.repository';
import { TradingRulesService } from '../trading-rules/trading-rule.service';
import { IndexService } from '../index/index.service';
import { LeverageMarginRepository } from 'src/models/repositories/leverage-margin.repository';
import { LeverageMarginEntity } from 'src/models/entities/leverage-margin.entity';
import { InstrumentEntity } from 'src/models/entities/instrument.entity';
import { LIST_SYMBOL_COINM, LIST_SYMBOL_USDM } from '../transaction/transaction.const';
import { AccountEntity } from 'src/models/entities/account.entity';

@Injectable()
export class PositionService extends BaseEngineService {
  constructor(
    @InjectRepository(PositionRepository, 'report')
    public readonly positionRepoReport: PositionRepository,
    @InjectRepository(PositionRepository, 'master')
    public readonly positionRepoMaster: PositionRepository,
    @InjectRepository(PositionHistoryRepository, 'master')
    public readonly positionHistoryRepository: PositionHistoryRepository,
    @InjectRepository(FundingHistoryRepository, 'master')
    public readonly fundingHistoryRepository: FundingHistoryRepository,
    @InjectRepository(MarginHistoryRepository, 'master')
    public readonly marginHistoryRepository: MarginHistoryRepository,
    private readonly accountService: AccountService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    public readonly kafkaClient: KafkaClient,
    @InjectRepository(OrderRepository, 'report')
    public readonly orderRepoReport: OrderRepository,
    @InjectRepository(OrderRepository, 'master')
    public readonly orderRepoMaster: OrderRepository,
    @InjectRepository(InstrumentRepository, 'report')
    public readonly instrumentRepoReport: InstrumentRepository,
    @InjectRepository(AccountRepository, 'report')
    public readonly accountRepoReport: AccountRepository,
    @InjectRepository(TradingRulesRepository, 'report')
    public readonly tradingRulesRepoReport: TradingRulesRepository,
    @InjectRepository(UserMarginModeRepository, 'report')
    public readonly userMarginModeRepoReport: UserMarginModeRepository,
    @InjectRepository(UserRepository, 'report')
    public readonly userRepoReport: UserRepository,
    @InjectRepository(LeverageMarginRepository, 'report')
    public readonly leverageMarginRepoReport: LeverageMarginRepository,
    public readonly instrumentService: InstrumentService,
    private readonly redisService: RedisService,
    private readonly tradingRulesService: TradingRulesService,
    public readonly indexService: IndexService,

    @InjectRepository(MarketDataRepository, 'report') private marketDataRepositoryReport: MarketDataRepository,
  ) {
    super();
  }

  async getAllPositionByUserId(userId: number, paging: PaginationDto, contractType: ContractType, symbol?: string) {
    const { offset, limit } = getQueryLimit(paging, MAX_RESULT_COUNT);
    // const limitInner = Math.min(paging.size * paging.page, MAX_RESULT_COUNT);

    const getPositionByTakeProfit = `
        SELECT pTp.*
      FROM positions as pTp
      LEFT JOIN orders as oTp on pTp.takeProfitOrderId = oTp.id
      WHERE pTp.userId = ${userId} and pTp.currentQty <> '0'  ${
      contractType == ContractType.ALL ? `` : `and pTp.contractType = '${contractType}'`
    }
      ${symbol ? `and pTp.symbol = '${symbol}'` : ``}
      ORDER BY pTp.updatedAt DESC
    `;

    const getPositionByStopLoss = `
SELECT pSl.*
        FROM positions as pSl
        LEFT JOIN orders as oSl on pSl.stopLossOrderId = oSl.id
        WHERE pSl.userId = ${userId} and pSl.currentQty <> '0' ${
      contractType == ContractType.ALL ? `` : `and pSl.contractType = '${contractType}'`
    }
        ${symbol ? `and pSl.symbol = '${symbol}'` : ``}
        ORDER BY pSl.updatedAt DESC
    `;

    const getAllQuery = `
      SELECT * FROM (
        (
          ${getPositionByTakeProfit} 
        )
      UNION 
        (
          ${getPositionByStopLoss}
      )) AS P
      ORDER BY P.updatedAt DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countQueryTakeProfit = `
    SELECT countTP.*
    FROM positions as countTP
    LEFT JOIN orders on  countTP.takeProfitOrderId = orders.id 
    WHERE countTP.userId = ${userId} and countTP.currentQty <> '0' ${
      contractType == ContractType.ALL ? `` : `and countTP.contractType = '${contractType}'`
    }
    ${symbol ? `and countTP.symbol = '${symbol}'` : ``}`;
    const countQueryStopLoss = `
    SELECT countSL.*
    FROM positions as countSL
    LEFT JOIN orders on  countSL.stopLossOrderId = orders.id
    WHERE countSL.userId = ${userId} and countSL.currentQty <> '0' ${
      contractType == ContractType.ALL ? `` : `and countSL.contractType = '${contractType}'`
    }
    ${symbol ? `and countSL.symbol = '${symbol}'` : ``}`;

    const queryCount = `
  SELECT COUNT(*) as count FROM (
    (
      ${countQueryTakeProfit} 
    )
  UNION 
    (
      ${countQueryStopLoss}
  )) AS totalItem
  `;
    const fills = await this.positionRepoReport.query(getAllQuery);

    const countResult = Number((await this.positionRepoReport.query(queryCount))[0].count);
    const totalItem = countResult;
    return {
      data: fills,
      metadata: {
        totalPage: Math.ceil(totalItem / paging.size),
        totalItem: totalItem,
      },
    };
  }

  async getAllPositionWithQuantity(userId: number, contractType: ContractType, symbol?: string) {
    // const { offset, limit } = getQueryLimit(paging, MAX_RESULT_COUNT);
    // const limitInner = Math.min(paging.size * paging.page, MAX_RESULT_COUNT);

    const getPositionByTakeProfit = `
        SELECT pTp.*
      FROM positions as pTp
      LEFT JOIN orders as oTp on pTp.takeProfitOrderId = oTp.id
      WHERE pTp.userId = ${userId} ${contractType == ContractType.ALL ? `` : `and pTp.contractType = '${contractType}'`}
      ${symbol ? `and pTp.symbol = '${symbol}'` : ``}
      ORDER BY pTp.updatedAt DESC
    `;

    const getPositionByStopLoss = `
SELECT pSl.*
        FROM positions as pSl
        LEFT JOIN orders as oSl on pSl.stopLossOrderId = oSl.id
        WHERE pSl.userId = ${userId} ${
      contractType == ContractType.ALL ? `` : `and pSl.contractType = '${contractType}'`
    }
        ${symbol ? `and pSl.symbol = '${symbol}'` : ``}
        ORDER BY pSl.updatedAt DESC`;

    const getAllQuery = `
      SELECT * FROM (
        (
          ${getPositionByTakeProfit} 
        )
      UNION 
        (
          ${getPositionByStopLoss}
      )) AS P
      ORDER BY P.updatedAt DESC
    `;

    const fills = await this.positionRepoReport.query(getAllQuery);

    return {
      data: fills,
    };
  }

  async getAllPositionByAdmin(
    paging: PaginationDto,
    queries?: AdminPositionDto,
  ): Promise<ResponseDto<PositionEntity[]>> {
    const startTime = moment(queries.from).format('YYYY-MM-DD 00:00:00');
    const endTime = moment(queries.to).format('YYYY-MM-DD 23:59:59');
    const commonAndConditions = {
      currentQty: Not(0),
    };

    if (queries.symbol) {
      commonAndConditions['symbol'] = Like(`%${queries.symbol}%`);
    }
    if (queries.contractType && queries.contractType !== ContractType.ALL) {
      commonAndConditions['contractType'] = Like(`%${queries.contractType}%`);
    }
    const { offset, limit } = getQueryLimit(paging, MAX_RESULT_COUNT);
    const query = this.positionRepoReport
      .createQueryBuilder('p')
      .select('p.*, u.email')
      // .innerJoin('accounts', 'ac', 'p.userId = ac.userId')
      .innerJoin('users', 'u', 'p.userId = u.id')
      .where([commonAndConditions])
      .andWhere('p.updatedAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      })
      .orderBy('p.updatedAt', 'DESC')
      .limit(limit)
      .offset(offset);

    const [positions, count] = await Promise.all([query.getRawMany(), query.getCount()]);

    return {
      data: positions,
      metadata: {
        total: count,
        totalPage: Math.ceil(count / paging.size),
      },
    };
  }

  async getPositionById(positionId: number): Promise<PositionEntity> {
    const position = await this.positionRepoReport.findOne({ id: positionId });
    if (!position) {
      throw new HttpException('Position not found', HttpStatus.NOT_FOUND);
    }
    return position;
  }

  async findBatch(fromId: number, count: number): Promise<PositionEntity[]> {
    return await this.positionRepoMaster.findBatch(fromId, count);
  }

  async findHistoryBefore(date: Date): Promise<PositionHistoryEntity | undefined> {
    return await this.positionHistoryRepository.findHistoryBefore(date);
  }

  async findHistoryBatch(fromId: number, count: number): Promise<PositionHistoryEntity[]> {
    return await this.positionHistoryRepository.findBatch(fromId, count);
  }

  async getLastPositionId(): Promise<number> {
    return await this.positionRepoMaster.getLastId();
  }

  async getPositionByUserIdBySymbol(userId: number, symbol: string): Promise<PositionEntity> {
    const position = await this.positionRepoReport.find({
      where: {
        userId,
        symbol: symbol,
      },
    });
    if (position[0]) return position[0];
    throw new HttpException(httpErrors.POSITION_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  public async updateMargin(userId: number, updateMarginDto: UpdateMarginDto) {
    const position = await this.positionRepoReport.findOne({
      where: {
        userId,
        id: updateMarginDto.positionId,
        isCross: false,
        currentQty: Not('0'),
      },
    });

    if (!position) {
      throw new HttpException(httpErrors.POSITION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const account = await this.accountRepoReport.findOne({
      userId,
      asset: position.asset,
    });

    const usdtAvailableBalance = new BigNumber(account.balance);
    if (usdtAvailableBalance.lt(+updateMarginDto.assignedMarginValue)) {
      throw new HttpException(httpErrors.NOT_ENOUGH_BALANCE, HttpStatus.BAD_REQUEST);
    }

    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.ADJUST_MARGIN_POSITION,
      data: {
        userId,
        accountId: account.id,
        symbol: position.symbol,
        assignedMarginValue: updateMarginDto.assignedMarginValue,
      },
    });
    return true;
  }

  async closePosition(userId: number, body: ClosePositionDto): Promise<OrderEntity> {
    const { positionId, quantity, type, limitPrice } = body;
    const defaultMarginMode = MarginMode.CROSS;
    const defaultLeverage = '20';
    const position = await this.positionRepoReport.findOne({
      where: {
        id: positionId,
        currentQty: Not('0'),
      },
    });
    if (!position) {
      throw new HttpException({ ...httpErrors.POSITION_NOT_FOUND, symbol: position.symbol }, HttpStatus.NOT_FOUND);
    }
    if (quantity > Math.abs(+position.currentQty)) {
      throw new HttpException(
        { ...httpErrors.POSITION_QUANTITY_NOT_ENOUGH, symbol: position.symbol },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (type === ClosePositionType.LIMIT) {
      await this.validateMinMaxPrice(position, limitPrice);
    }

    const instrument = await this.instrumentRepoReport.findOne({
      where: {
        symbol: position.symbol,
      },
    });
    const [marginMode, account] = await Promise.all([
      this.userMarginModeRepoReport.findOne({
        where: {
          instrumentId: instrument.id,
          userId,
        },
      }),
      this.accountRepoReport.findOne({
        where: {
          userId,
          asset: position.asset,
        },
      }),
    ]);
    let closeOrder: OrderEntity;
    switch (type) {
      case ClosePositionType.MARKET:
        closeOrder = await this.orderRepoMaster.save({
          userId: position.userId,
          accountId: account.id,
          side: +position.currentQty > 0 ? OrderSide.SELL : OrderSide.BUY,
          quantity: `${quantity}`,
          type: OrderType.MARKET,
          symbol: position.symbol,
          timeInForce: OrderTimeInForce.IOC,
          status: OrderStatus.PENDING,
          asset: position.asset,
          marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
          leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
          remaining: `${quantity}`,
          isClosePositionOrder: true,
          isReduceOnly: true,
          contractType: instrument.contractType,
          userEmail: account.userEmail,
          originalCost: '0',
          originalOrderMargin: '0',
        });
        break;
      case ClosePositionType.LIMIT:
        closeOrder = await this.orderRepoMaster.save({
          userId: position.userId,
          accountId: account.id,
          side: +position.currentQty > 0 ? OrderSide.SELL : OrderSide.BUY,
          quantity: `${quantity}`,
          price: limitPrice,
          type: OrderType.LIMIT,
          symbol: position.symbol,
          timeInForce: OrderTimeInForce.GTC,
          status: OrderStatus.PENDING,
          asset: position.asset,
          marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
          leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
          remaining: `${quantity}`,
          isClosePositionOrder: true,
          isReduceOnly: true,
          contractType: instrument.contractType,
          userEmail: account.userEmail,
          originalCost: '0',
          originalOrderMargin: '0',
        });
        break;
      default:
        break;
    }
    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.PLACE_ORDER,
      data: plainToClass(OrderEntity, closeOrder),
    });
    return closeOrder;
  }

  async closeAllPosition(userId: number, contractType: ContractType): Promise<boolean> {
    const defaultMarginMode = MarginMode.CROSS;
    const defaultLeverage = '20';
    const [positions, orders] = await Promise.all([
      this.positionRepoReport.find({
        where: {
          userId,
          currentQty: Not('0'),
          contractType: contractType,
        },
      }),
      this.orderRepoReport.find({
        userId,
        contractType: contractType,
        status: In([OrderStatus.ACTIVE, OrderStatus.UNTRIGGERED, OrderStatus.PENDING]),
      }),
    ]);
    if (positions.length === 0) {
      throw new HttpException(httpErrors.ACCOUNT_HAS_NO_POSITION, HttpStatus.NOT_FOUND);
    }
    if (orders.length > 0) {
      await Promise.all(
        orders.map((order) => {
          this.kafkaClient.send(KafkaTopics.matching_engine_input, {
            code: CommandCode.CANCEL_ORDER,
            data: order,
          });
        }),
      );
    }
    await Promise.all(
      positions.map(async (position) => {
        const instrument = await this.instrumentRepoReport.findOne({
          where: {
            symbol: position.symbol,
          },
        });
        const marginMode = await this.userMarginModeRepoReport.findOne({
          where: {
            instrumentId: instrument.id,
            userId,
          },
        });
        const account = await this.accountRepoReport.findOne({
          where: {
            userId,
            asset: position.asset,
          },
        });
        const cancelOrder = await this.orderRepoMaster.save({
          userId,
          accountId: account.id,
          side: +position.currentQty > 0 ? OrderSide.SELL : OrderSide.BUY,
          quantity: `${Math.abs(+position.currentQty)}`,
          type: OrderType.MARKET,
          symbol: position.symbol,
          timeInForce: OrderTimeInForce.IOC,
          status: OrderStatus.PENDING,
          asset: position.asset,
          marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
          leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
          remaining: `${Math.abs(+position.currentQty)}`,
          isClosePositionOrder: true,
          contractType: instrument.contractType,
          userEmail: account.userEmail,
          originalCost: '0',
          originalOrderMargin: '0',
        });
        await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
          code: CommandCode.PLACE_ORDER,
          data: plainToClass(OrderEntity, cancelOrder),
        });
      }),
    );
    return true;
  }

  private async validateUpdatePosition(updatePositionDto: UpdatePositionDto, position: PositionEntity): Promise<void> {
    const { takeProfit, stopLoss } = updatePositionDto;
    const checkPrice = position.entryPrice;

    let maxPrice = await this.cacheManager.get(`${MAX_PRICE}_${position.symbol}`);
    let minPrice = await this.cacheManager.get(`${MIN_PRICE}_${position.symbol}`);
    if (!maxPrice) {
      const instrument = await this.instrumentRepoReport.findOne({ symbol: position.symbol });
      maxPrice = instrument.maxPrice;
      await this.cacheManager.set(`${MAX_PRICE}_${position.symbol}`, maxPrice, { ttl: Number.MAX_SAFE_INTEGER });
    }
    if (!minPrice) {
      const tradingRule = await this.tradingRulesRepoReport.findOne({ symbol: position.symbol });
      minPrice = tradingRule.minPrice;
      await this.cacheManager.set(`${MIN_PRICE}_${position.symbol}`, minPrice, { ttl: Number.MAX_SAFE_INTEGER });
    }

    if (takeProfit && (+takeProfit < minPrice || +takeProfit > maxPrice)) {
      throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
    }
    if (stopLoss && (+stopLoss < minPrice || +stopLoss > maxPrice)) {
      throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
    }
    if (+position.currentQty > 0) {
      if (takeProfit && +takeProfit <= +checkPrice) {
        throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
      if (stopLoss && +stopLoss >= +checkPrice) {
        throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
    } else {
      if (takeProfit && +takeProfit >= +checkPrice) {
        throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
      if (stopLoss && +stopLoss <= +checkPrice) {
        throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updatePosition(userId: number, updatePositionDto: UpdatePositionDto): Promise<void> {
    const { positionId, takeProfit, stopLoss, takeProfitTrigger, stopLossTrigger } = updatePositionDto;
    const whereCondition = {
      id: positionId,
      userId,
      currentQty: Not('0'),
    };

    const position = await this.positionRepoReport.findOne({
      where: {
        ...whereCondition,
      },
    });
    if (!position) {
      throw new HttpException(httpErrors.POSITION_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    if (
      (!takeProfit && !stopLoss) ||
      (!takeProfitTrigger && !stopLossTrigger) ||
      (!takeProfit && takeProfitTrigger) ||
      (takeProfit && !takeProfitTrigger) ||
      (!stopLoss && stopLossTrigger) ||
      (stopLoss && !stopLossTrigger)
    ) {
      throw new HttpException(httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
    }
    await this.validateUpdatePosition(updatePositionDto, position);

    let stopLossOrder: Partial<OrderEntity>;
    let takeProfitOrder: Partial<OrderEntity>;
    const tpSlOrder: TakeProfitStopLossOrder = {
      stopLossOrderId: null,
      takeProfitOrderId: null,
    };
    const objectSend = {};
    const account = await this.accountRepoReport.findOne({
      where: {
        userId,
        asset: position.asset,
      },
    });

    if (stopLoss && position.stopLossOrderId === null) {
      stopLossOrder = await this.orderRepoMaster.save({
        symbol: position.symbol,
        type: OrderType.MARKET,
        quantity: `${Math.abs(+position.currentQty)}`,
        remaining: `${Math.abs(+position.currentQty)}`,
        isReduceOnly: true,
        tpSLType: TpSlType.STOP_MARKET,
        tpSLPrice: stopLoss,
        status: OrderStatus.PENDING,
        timeInForce: OrderTimeInForce.IOC,
        userId: userId,
        accountId: account.id,
        side: +position.currentQty > 0 ? OrderSide.SELL : OrderSide.BUY,
        asset: position.asset.toUpperCase(),
        leverage: position.leverage,
        marginMode: position.isCross ? MarginMode.CROSS : MarginMode.ISOLATE,
        price: null,
        trigger: stopLossTrigger,
        orderValue: '0',
        stopLoss: null,
        takeProfit: null,
        stopCondition: +position.currentQty > 0 ? OrderStopCondition.LT : OrderStopCondition.GT,
        isClosePositionOrder: true,
        isTpSlOrder: true,
        contractType: position.contractType,
        userEmail: account.userEmail,
        originalCost: '0',
        originalOrderMargin: '0',
      });
      tpSlOrder.stopLossOrderId = stopLossOrder.id;
      objectSend['slOrder'] = {
        ...stopLossOrder,
        createdAt: new Date(stopLossOrder.createdAt).getTime(),
        updatedAt: new Date(stopLossOrder.updatedAt).getTime(),
        action: ActionAdjustTpSl.PLACE,
      };
    }
    if (takeProfit && position.takeProfitOrderId === null) {
      takeProfitOrder = await this.orderRepoMaster.save({
        symbol: position.symbol,
        type: OrderType.MARKET,
        quantity: `${Math.abs(+position.currentQty)}`,
        remaining: `${Math.abs(+position.currentQty)}`,
        isReduceOnly: true,
        tpSLType: TpSlType.TAKE_PROFIT_MARKET,
        tpSLPrice: takeProfit,
        status: OrderStatus.PENDING,
        timeInForce: OrderTimeInForce.IOC,
        userId: userId,
        accountId: account.id,
        side: +position.currentQty > 0 ? OrderSide.SELL : OrderSide.BUY,
        asset: position.asset.toUpperCase(),
        leverage: position.leverage,
        marginMode: position.isCross ? MarginMode.CROSS : MarginMode.ISOLATE,
        price: null,
        trigger: takeProfitTrigger,
        orderValue: '0',
        stopLoss: null,
        takeProfit: null,
        stopCondition: +position.currentQty > 0 ? OrderStopCondition.GT : OrderStopCondition.LT,
        isClosePositionOrder: true,
        contractType: position.contractType,
        userEmail: account.userEmail,
        originalCost: '0',
        originalOrderMargin: '0',
      });
      tpSlOrder.takeProfitOrderId = takeProfitOrder.id;
      objectSend['tpOrder'] = {
        ...takeProfitOrder,
        createdAt: new Date(takeProfitOrder.createdAt).getTime(),
        updatedAt: new Date(takeProfitOrder.updatedAt).getTime(),
        action: ActionAdjustTpSl.PLACE,
      };
    }
    if (stopLossOrder) {
      objectSend['slOrder'].linkedOrderId = tpSlOrder.takeProfitOrderId ? tpSlOrder.takeProfitOrderId : null;
    }
    if (takeProfitOrder) {
      objectSend['tpOrder'].linkedOrderId = tpSlOrder.stopLossOrderId ? tpSlOrder.stopLossOrderId : null;
    }
    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.ADJUST_TP_SL,
      data: {
        ...objectSend,
        userId,
        symbol: position.symbol,
        accountId: account.id,
      },
    });
  }

  async removeTpSlPosition(userId: number, removeTpSlDto: RemoveTpSlDto): Promise<void> {
    const { positionId, takeProfitOrderId, stopLossOrderId } = removeTpSlDto;
    if ((!takeProfitOrderId && !stopLossOrderId) || (takeProfitOrderId && stopLossOrderId)) {
      throw new HttpException(httpErrors.PARAMS_REMOVE_TP_SL_POSITION_NOT_VALID, HttpStatus.BAD_REQUEST);
    }
    const position = await this.positionRepoReport.findOne({
      where: {
        id: +positionId,
        userId,
        currentQty: Not('0'),
      },
    });
    if (!position) {
      throw new HttpException(httpErrors.POSITION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    let order: OrderEntity;
    const objectSend = {};

    if (takeProfitOrderId) {
      order = await this.orderRepoReport.findOne(+takeProfitOrderId);
      objectSend['tpOrder'] = {
        ...order,
        createdAt: new Date(order.createdAt).getTime(),
        updatedAt: new Date(order.updatedAt).getTime(),
        action: ActionAdjustTpSl.CANCEL,
      };
    } else {
      order = await this.orderRepoReport.findOne(+stopLossOrderId);
      objectSend['slOrder'] = {
        ...order,
        createdAt: new Date(order.createdAt).getTime(),
        updatedAt: new Date(order.updatedAt).getTime(),
        action: ActionAdjustTpSl.CANCEL,
      };
    }

    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.ADJUST_TP_SL,
      data: {
        ...objectSend,
        userId,
        symbol: position.symbol,
        accountId: position.accountId,
      },
    });
  }

  async getTpSlOrderPosition(userId: number, positionId: number): Promise<OrderEntity[]> {
    const position = await this.positionRepoReport.findOne(positionId);
    if (!position) {
      throw new HttpException(httpErrors.POSITION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const orders = await this.orderRepoReport.find({
      where: [
        {
          userId,
          id: position.takeProfitOrderId,
        },
        {
          userId,
          id: position.stopLossOrderId,
        },
      ],
    });
    return orders;
  }

  async calPositionMarginForAcc(
    accountId: number,
    asset: string,
  ): Promise<{
    positionMargin: string;
    unrealizedPNL: string;
    positionMarginCross: string;
    positionMarginIsIsolate: string;
  }> {
    const instruments = await this.instrumentService.getAllSymbolInstrument();
    if (!instruments.length) {
      return {
        positionMargin: '0',
        unrealizedPNL: '0',
        positionMarginCross: '0',
        positionMarginIsIsolate: '0',
      };
    }

    const positionCross = await this.CalPositionMarginIsCross(accountId, asset);
    const positionMarginCross = positionCross.margin;
    const unrealizedPNL = positionCross.pnl;

    const positionMarginIsIsolate = await this.calPositionMarginIsIsolate(instruments, accountId, asset);

    return {
      positionMargin: new BigNumber(positionMarginIsIsolate).plus(positionMarginCross).toString(),
      unrealizedPNL,
      positionMarginCross,
      positionMarginIsIsolate,
    };
  }

  async calPositionMarginIsIsolate(symbols: any, accountId: number, asset: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { margin } = await this.positionRepoMaster
      .createQueryBuilder('positions')
      .select('SUM(abs(positions.currentQty) * positions.entryPrice / positions.leverage) as margin')
      .where({
        isCross: false,
      })
      .andWhere('positions.symbol IN (:symbols)', { symbols })
      .andWhere({ accountId, asset })
      .getRawOne();
    return margin ? margin : 0;
  }

  async CalPositionMarginIsCross(accountId: number, asset: string) {
    const listPositions = await this.positionRepoReport
      .createQueryBuilder('p')
      .select(['p.currentQty as currentQty', 'p.leverage as leverage', 'p.entryPrice as entryPrice, p.symbol'])
      .where({
        isCross: true,
        accountId,
        asset,
      })
      .getRawMany();

    const markPrices = await Promise.all(
      listPositions.map((item) => this.cacheManager.get<string>(`${INDEX_PRICE_PREFIX}${item.symbol}`)),
    );

    let margin = '0';
    let pnl = '0';

    if (!listPositions.length) {
      return { margin, pnl };
    }

    for (let i = 0; i < listPositions.length; i++) {
      const item = listPositions[i];
      const markPrice = markPrices[i];
      const margin1 = new BigNumber(item.currentQty).abs().times(markPrice).div(item.leverage).toString();
      const curPnl = new BigNumber(item.currentQty).abs().times(new BigNumber(markPrice).minus(item.entryPrice));
      let pnl1 = curPnl.toString();

      if (new BigNumber(item.currentQty).lt(0)) {
        pnl1 = curPnl.negated().toString();
      }

      margin = new BigNumber(margin).plus(margin1).toString();
      pnl = new BigNumber(pnl).plus(pnl1).toString();
    }

    return { margin, pnl };
  }

  async updatePositions(): Promise<void> {
    const data = await this.positionRepoReport.find();
    if (data) {
      for (const item of data) {
        item.userId = item.accountId;
        const account = await this.accountRepoReport.findOne({
          where: {
            asset: item.asset.toUpperCase(),
            userId: item.userId,
          },
        });
        if (account) {
          item.accountId = account.id;
        } else {
          item.accountId = null;
        }
        await this.positionRepoMaster.save(item);
      }
    }
  }

  public async calculateIndexPriceAverage(symbol: string) {
    const instrument = await this.instrumentService.findBySymbol(symbol);
    const newSymbol = symbol.replace('USDM', 'USDT');
    const now = new Date().getTime();
    const previousTime = now - PREVIOUS_TIME;
    const startTime = moment(previousTime).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(now).format('YYYY-MM-DD HH:mm:ss');
    const history = await this.marketDataRepositoryReport
      .createQueryBuilder('marketData')
      .select('marketData.index')
      .where('createdAt BETWEEN :startTime and :endTime ', { startTime, endTime })
      .andWhere(`symbol = :newSymbol`, { newSymbol })
      .getMany();
    const sumIndexPrice = history.reduce((acc, curr) => acc + parseFloat(curr.index), 0);
    const averageIndexPrice = (sumIndexPrice / history.length).toFixed(Number(instrument.maxFiguresForPrice));
    return { averageIndexPrice, history };
  }

  private async validateMinMaxPrice(position, limitPrice) {
    const [tradingRules, instrument, markPrice] = await Promise.all([
      this.tradingRulesService.getTradingRuleByInstrumentId(position.symbol) as any,
      this.instrumentRepoReport.findOne({ where: { symbol: position.symbol } }),
      this.redisService.getClient().get(`${ORACLE_PRICE_PREFIX}${position.symbol}`),
    ]);
    let price: BigNumber;
    let minPrice = new BigNumber(tradingRules?.minPrice);
    let maxPrice = new BigNumber(instrument?.maxPrice);
    if (+position.currentQty > 0) {
      price = new BigNumber(markPrice).times(
        new BigNumber(1).minus(new BigNumber(tradingRules?.floorRatio).dividedBy(100)),
      );
      minPrice = BigNumber.maximum(new BigNumber(tradingRules?.minPrice), price);
      if (new BigNumber(limitPrice).isLessThan(minPrice))
        throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      // validate max Price:
      if (new BigNumber(limitPrice).isGreaterThan(instrument.maxPrice)) {
        throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }
    } else {
      price = new BigNumber(markPrice).times(
        new BigNumber(1).plus(new BigNumber(tradingRules?.limitOrderPrice).dividedBy(100)),
      );
      maxPrice = BigNumber.minimum((new BigNumber(instrument?.maxPrice), price));
      if (new BigNumber(limitPrice).isLessThan(minPrice))
        throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (new BigNumber(limitPrice).isGreaterThan(maxPrice))
        throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
    }
  }

  async closeAllPositionCommand(symbol?: string): Promise<void> {
    const defaultMarginMode = MarginMode.CROSS;
    const defaultLeverage = '20';
    let wherePosition = {};
    let whereOrder = {};
    if (symbol) {
      wherePosition = {
        symbol: symbol.toUpperCase(),
      };
      whereOrder = {
        symbol: symbol.toUpperCase(),
      };
    }
    const [positions, orders] = await Promise.all([
      this.positionRepoReport.find({
        where: {
          currentQty: Not('0'),
          ...wherePosition,
        },
      }),
      this.orderRepoReport.find({
        status: In([OrderStatus.ACTIVE, OrderStatus.UNTRIGGERED, OrderStatus.PENDING]),
        ...whereOrder,
      }),
    ]);

    if (orders.length > 0) {
      await Promise.all(
        orders.map((order) => {
          this.kafkaClient.send(KafkaTopics.matching_engine_input, {
            code: CommandCode.CANCEL_ORDER,
            data: order,
          });
        }),
      );
    }

    if (positions.length === 0) {
      console.log('no postions');
      return;
    }

    const chunkSize = 100;
    let offset = 0;

    const positionSymbols = positions.map((position) => position.symbol);
    const symbolMap = {};
    for (const symbol of positionSymbols) {
      symbolMap[symbol] = await this.calculateIndexPriceAverage(symbol);
    }

    while (offset < positions.length) {
      const chunk = positions.slice(offset, offset + chunkSize);

      await Promise.all(
        chunk.map(async (position) => {
          const instrument = await this.instrumentRepoReport.findOne({
            where: {
              symbol: position.symbol,
            },
          });
          const marginMode = await this.userMarginModeRepoReport.findOne({
            where: {
              instrumentId: instrument.id,
              userId: position.userId,
            },
          });
          const account = await this.accountRepoReport.findOne({
            where: {
              userId: position.userId,
              asset: position.asset,
            },
          });
          if (!account) {
            return;
          }
          const { averageIndexPrice } = symbolMap[position.symbol];
          const cancelOrder = await this.orderRepoMaster.save({
            userId: position.userId,
            accountId: account.id,
            side: +position.currentQty > 0 ? OrderSide.SELL : OrderSide.BUY,
            quantity: `${Math.abs(+position.currentQty)}`,
            type: OrderType.LIMIT,

            symbol: position.symbol,
            timeInForce: OrderTimeInForce.GTC,
            status: OrderStatus.PENDING,
            asset: position.asset,
            marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
            leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
            remaining: `${Math.abs(+position.currentQty)}`,
            isClosePositionOrder: true,
            contractType: instrument.contractType,
            userEmail: account.userEmail,
            price: averageIndexPrice,
          });
          await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
            code: CommandCode.PLACE_ORDER,
            data: plainToClass(OrderEntity, cancelOrder),
          });
        }),
      );

      offset += chunk.length;
    }
  }

  async updateIdPositionCommand(): Promise<void> {
    const startPositionId = MIN_ORDER_ID;
    const positions = await this.positionRepoReport.find();
    let offset = 0;
    for (const position of positions) {
      const newPositionId = +startPositionId + +offset;
      await this.positionRepoMaster.update({ id: position.id }, { id: newPositionId, updatedAt: position.updatedAt });
      await this.positionHistoryRepository.update(
        { positionId: `${position.id}` },
        { positionId: `${newPositionId}`, updatedAt: () => 'position_histories.updatedAt' },
      );
      await this.marginHistoryRepository.update(
        { positionId: `${position.id}` },
        { positionId: `${newPositionId}`, updatedAt: () => 'margin_histories.updatedAt' },
      );
      await this.fundingHistoryRepository.update(
        { positionId: `${position.id}` },
        { positionId: `${newPositionId}`, updatedAt: () => 'funding_histories.updatedAt' },
      );
      offset++;
    }
  }

  async getInforPositions(userId: number, symbol?: string) {
    const listSymbol = [...LIST_SYMBOL_COINM, ...LIST_SYMBOL_USDM];

    const response = [];
    if (symbol) {
      if (!listSymbol.includes(symbol)) {
        throw new HttpException(httpErrors.SYMBOL_DOES_NOT_EXIST, HttpStatus.NOT_FOUND);
      }
      const result = await this.getInforAPosition(symbol, userId);
      if (Object.keys(result).length === 0) {
        return response;
      }
      response.push(result);
    } else {
      for (const symbol of listSymbol) {
        const result = await this.getInforAPosition(symbol, userId);
        if (Object.keys(result).length !== 0) {
          response.push(result);
        }
      }
    }
    return response;
  }

  private getLeverageMargin(leverageMargin: LeverageMarginEntity[], checkValue: string): LeverageMarginEntity {
    let selected = null;
    for (const item of leverageMargin) {
      const bigNumberCheckValue = new BigNumber(checkValue);
      if (
        new BigNumber(item.min).isLessThanOrEqualTo(checkValue) &&
        bigNumberCheckValue.isLessThanOrEqualTo(new BigNumber(item.max))
      ) {
        selected = item;
      }
    }
    if (selected === null) {
      selected = leverageMargin[leverageMargin.length - 1];
    }
    return selected;
  }

  private calMaintenanceMargin(
    leverageMargin: LeverageMarginEntity[],
    checkTier: string,
    position: PositionEntity,
    oraclePrice: string,
    contractType: string,
    instrument?: InstrumentEntity,
  ): string {
    if (contractType === ContractType.USD_M) {
      const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);
      const maintenanceMargin = new BigNumber(position.currentQty)
        .abs()
        .times(new BigNumber(oraclePrice))
        .times(new BigNumber(selectedLeverageMargin.maintenanceMarginRate / 100))
        .minus(selectedLeverageMargin.maintenanceAmount)
        .toString();
      return maintenanceMargin;
    } else {
      const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);

      const maintenanceMargin = new BigNumber(position.currentQty)
        .abs()
        .times(new BigNumber(instrument.multiplier).div(new BigNumber(oraclePrice)))
        .times(selectedLeverageMargin.maintenanceMarginRate / 100)
        .minus(selectedLeverageMargin.maintenanceAmount)
        .toString();
      return maintenanceMargin;
    }
  }

  private async calMarginBalanceForCrossUSDM(
    userId: number,
    asset: string,
    oraclePrice: string,
    account: AccountEntity,
  ): Promise<string> {
    const positions = await this.positionRepoReport.find({ where: { userId, asset, currentQty: Not('0') } });
    let totalAllocatedMargin = '0';
    let totalUnrealizedPnl = '0';
    for (const position of positions) {
      const sideValue = +position.currentQty > 0 ? 1 : -1;
      const itemOraclePrice = await this.indexService.getOraclePrices([position.symbol]);

      if (position.isCross) {
        const unrealizedPNL = new BigNumber(
          Math.abs(+position.currentQty) * (+itemOraclePrice[0] - +position.entryPrice) * sideValue,
        ).toString();
        totalUnrealizedPnl = new BigNumber(totalUnrealizedPnl).plus(new BigNumber(unrealizedPNL)).toString();
      } else {
        const allocatedMargin = +position.positionMargin + +position.adjustMargin;
        totalAllocatedMargin = new BigNumber(totalAllocatedMargin).plus(new BigNumber(allocatedMargin)).toString();
      }
    }
    const marginBalance = new BigNumber(account.balance)
      .plus(new BigNumber(totalUnrealizedPnl))
      .minus(new BigNumber(totalAllocatedMargin));
    return marginBalance.toString();
  }

  private async calMarginBalanceForCrossCOINM(
    userId: number,
    asset: string,
    oraclePrice: string,
    instrument: InstrumentEntity,
    account: AccountEntity,
  ): Promise<string> {
    const positions = await this.positionRepoReport.find({ where: { userId, asset, currentQty: Not('0') } });
    let totalAllocatedMargin = '0';
    let totalUnrealizedPnl = '0';
    for (const position of positions) {
      const sideValue = +position.currentQty > 0 ? 1 : -1;
      if (position.isCross) {
        const unrealizedPNL = new BigNumber(
          Math.abs(+position.currentQty) *
            +instrument.multiplier *
            (1 / +position.entryPrice - 1 / +oraclePrice) *
            sideValue,
        ).toString();
        totalUnrealizedPnl = new BigNumber(totalUnrealizedPnl).plus(new BigNumber(unrealizedPNL)).toString();
      } else {
        const allocatedMargin = +position.positionMargin + +position.adjustMargin;
        totalAllocatedMargin = new BigNumber(totalAllocatedMargin).plus(new BigNumber(allocatedMargin)).toString();
      }
    }
    const marginBalance = new BigNumber(account.balance)
      .plus(new BigNumber(totalUnrealizedPnl))
      .minus(new BigNumber(totalAllocatedMargin));
    return marginBalance.toString();
  }
  private calMarginBalanceForIso(allocatedMargin: string, unrealizedPNL: string): string {
    return new BigNumber(allocatedMargin).plus(new BigNumber(unrealizedPNL)).toString();
  }

  private async getInforAPosition(symbol: string, userId: number) {
    const result = {};
    if (symbol) {
      const [position, oraclePrice, indexPrice, instrument, leverageMargin] = await Promise.all([
        this.positionRepoReport.findOne({ where: { symbol, userId, currentQty: Not('0') } }),
        this.indexService.getOraclePrices([symbol]),
        this.indexService.getIndexPrices([symbol]),
        this.instrumentRepoReport.findOne({ where: { symbol } }),
        this.leverageMarginRepoReport.find({
          where: {
            symbol,
          },
        }),
      ]);

      if (position) {
        result[`${symbol}`] = { ...position };
        result[`${symbol}`][`averageOpeningPrice`] = position.entryPrice;
        // result[`${symbol}`][`averageClosingPrice`] = position.;
        result[`${symbol}`][`marginType`] = position.isCross ? 'CROSS' : 'ISOLATED';
        result[`${symbol}`][`indexPrice`] = indexPrice[0];
        result[`${symbol}`][`markPrice`] = oraclePrice[0];
        result[`${symbol}`]['liquidationPrice'] = position.liquidationPrice;
        result[`${symbol}`]['totalPosition'] = position.currentQty;
        result[`${symbol}`]['averageClosingPrice'] = position.avgClosePrice;
        result[`${symbol}`]['closingPosition'] = position.closeSize;

        // const maintenanceMargin =
        const checkTier =
          position.contractType === ContractType.COIN_M
            ? oraclePrice[0]
              ? new BigNumber(position.currentQty).abs().times(instrument.multiplier).div(oraclePrice[0]).toString()
              : '0'
            : new BigNumber(position.currentQty).abs().times(oraclePrice[0]).toString();
        let allocatedMargin = '0';
        const sideValue = +position.currentQty > 0 ? 1 : -1;
        const account = await this.accountRepoReport.findOne({ where: { asset: position.asset, userId } });
        switch (position.contractType) {
          case ContractType.COIN_M:
            // calculate position margin
            if (position.isCross) {
              // cal liquidation price
              const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);
              const numerator = new BigNumber(
                new BigNumber(position.currentQty).abs().times(selectedLeverageMargin.maintenanceMarginRate / 100),
              )
                .plus(new BigNumber(new BigNumber(sideValue)).times(new BigNumber(position.currentQty).abs()))
                .toString();
              const denominator = new BigNumber(
                new BigNumber(+account.balance + +selectedLeverageMargin.maintenanceAmount).div(
                  new BigNumber(instrument.multiplier),
                ),
              )
                .plus(new BigNumber((sideValue * Math.abs(+position.currentQty)) / +position.entryPrice))
                .toString();
              result[`${symbol}`]['liquidationPrice'] = new BigNumber(numerator)
                .div(new BigNumber(denominator))
                .toString();
              console.log('check liquidtion coin m: ', {
                position,
                numerator,
                denominator,
                selectedLeverageMargin,
                instrument,
              });
              // End cal Liquidation
              const allocatedMargin = new BigNumber(position.currentQty)
                .abs()
                .times(instrument.multiplier)
                .div(new BigNumber(position.leverage).times(new BigNumber(oraclePrice[0])))
                .toString();
              result[`${symbol}`]['positionMargin'] = new BigNumber(allocatedMargin).toString();
            } else {
              allocatedMargin = new BigNumber(position.positionMargin)
                .plus(new BigNumber(position.adjustMargin))
                .toString();
              result[`${symbol}`]['positionMargin'] = new BigNumber(allocatedMargin).toString();
            }
            // console.log({ allocatedMargin, position, indexPrice, oraclePrice, result });

            result[`${symbol}`]['unrealizedPNL'] = new BigNumber(
              Math.abs(+position.currentQty) *
                +instrument.multiplier *
                (1 / +position.entryPrice - 1 / +oraclePrice[0]) *
                sideValue,
            ).toString();
            // result[`${symbol}`]['unrealizedROE'] = new BigNumber(
            //   (result[`${symbol}`]['unrealizedPNL'] / allocatedMargin) * 100,
            // ).toString();
            const maintenanceMarginCOINM = this.calMaintenanceMargin(
              leverageMargin,
              checkTier,
              position,
              oraclePrice[0],
              ContractType.COIN_M,
              instrument,
            );
            const marginBalanceCOINM = position.isCross
              ? await this.calMarginBalanceForCrossCOINM(userId, position.asset, oraclePrice[0], instrument, account)
              : this.calMarginBalanceForIso(allocatedMargin, result[`${symbol}`]['unrealizedPNL']);
            // cal margin rate
            result[`${symbol}`]['marginRate'] = new BigNumber(maintenanceMarginCOINM)
              .div(new BigNumber(marginBalanceCOINM))
              .times(100)
              .toString();
            break;
          case ContractType.USD_M:
            //calculate position margin
            if (position.isCross) {
              allocatedMargin = new BigNumber(position.currentQty)
                .abs()
                .times(new BigNumber(oraclePrice[0]))
                .div(new BigNumber(position.leverage))
                .toString();
              result[`${symbol}`]['positionMargin'] = new BigNumber(allocatedMargin).toString();
              const assetPosition = await this.positionRepoReport.find({
                where: { asset: position.asset, userId: userId, currentQty: Not('0') },
              });
              let Ipm = '0';
              let Tmm = '0';
              let Upnl = '0';
              const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);

              for (const itemPosition of assetPosition) {
                if (!itemPosition.isCross) {
                  Ipm = new BigNumber(Ipm)
                    .plus(new BigNumber(itemPosition.positionMargin))
                    .plus(new BigNumber(itemPosition.adjustMargin))
                    .toString();
                }
                if (itemPosition.isCross && itemPosition.symbol !== position.symbol) {
                  const [oraclePriceItem, itemLeverageMarginArr] = await Promise.all([
                    this.indexService.getOraclePrices([itemPosition.symbol]),
                    this.leverageMarginRepoReport.find({ where: { symbol: itemPosition.symbol } }),
                  ]);
                  const itemSideValue = +itemPosition.currentQty > 0 ? 1 : -1;
                  const notionalValue = new BigNumber(itemPosition.currentQty)
                    .abs()
                    .times(oraclePriceItem[0])
                    .toString();
                  const itemLeverageMargin = this.getLeverageMargin(itemLeverageMarginArr, notionalValue);
                  Tmm = new BigNumber(Tmm)
                    .plus(
                      new BigNumber(
                        Math.abs(+itemPosition.currentQty) *
                          +oraclePriceItem[0] *
                          (itemLeverageMargin.maintenanceMarginRate / 100),
                      ).minus(new BigNumber(itemLeverageMargin.maintenanceAmount)),
                    )
                    .toString();
                  Upnl = new BigNumber(Upnl)
                    .plus(
                      new BigNumber(itemPosition.currentQty)
                        .abs()
                        .times(new BigNumber(oraclePriceItem[0]).minus(new BigNumber(itemPosition.entryPrice)))
                        .times(itemSideValue),
                    )
                    .toString();
                }
              }
              const numerator = new BigNumber(account.balance)
                .minus(new BigNumber(Ipm))
                .minus(new BigNumber(Tmm))
                .plus(new BigNumber(Upnl))
                .plus(new BigNumber(selectedLeverageMargin.maintenanceAmount))
                .minus(
                  new BigNumber(sideValue).times(new BigNumber(position.currentQty).abs()).times(position.entryPrice),
                );
              const denominator = new BigNumber(
                (Math.abs(+position.currentQty) * selectedLeverageMargin.maintenanceMarginRate) / 100,
              ).minus(new BigNumber(sideValue * Math.abs(+position.currentQty)));
              result[`${symbol}`]['liquidationPrice'] = new BigNumber(numerator)
                .div(new BigNumber(denominator))
                .toString();
              console.log('check liquidation price usdm: ', {
                selectedLeverageMargin,
                Tmm,
                Upnl,
                Ipm,
                oraclePrice: oraclePrice[0],
                position,
                denominator: denominator.toString(),
                numerator: numerator.toString(),
              });
            } else {
              allocatedMargin = new BigNumber(position.positionMargin).plus(position.adjustMargin).toString();
              result[`${symbol}`]['positionMargin'] = new BigNumber(allocatedMargin).toString();
              // check again funding fee
            }
            console.log({ allocatedMargin, position, indexPrice, oraclePrice, result });

            //calculate pnl
            result[`${symbol}`]['unrealizedPNL'] = new BigNumber(
              Math.abs(+position.currentQty) * (+oraclePrice[0] - +position.entryPrice) * sideValue,
            ).toString();
            // result[`${symbol}`]['unrealizedROE'] = new BigNumber(
            //   (result[`${symbol}`]['unrealizedPNL'] / allocatedMargin) * 100,
            // ).toString();
            const maintenanceMarginUSDM = this.calMaintenanceMargin(
              leverageMargin,
              checkTier,
              position,
              oraclePrice[0],
              ContractType.USD_M,
            );
            const marginBalanceUSDM = position.isCross
              ? await this.calMarginBalanceForCrossUSDM(userId, position.asset, oraclePrice[0], account)
              : this.calMarginBalanceForIso(allocatedMargin, result[`${symbol}`]['unrealizedPNL']);
            result[`${symbol}`]['marginRate'] = new BigNumber(maintenanceMarginUSDM)
              .div(new BigNumber(marginBalanceUSDM))
              .times(100)
              .toString();
            console.log({
              maintenanceMarginUSDM,
              marginBalanceUSDM,
              leverageMargin,
              checkTier,
              position,
              oraclePrice: oraclePrice[0],
            });
            break;
          default:
            break;
        }
      }
    }
    return result;
  }
}
