import { AdminOrderDto } from './dto/admin-order.dto';
import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { plainToClass } from 'class-transformer';
import { Producer } from 'kafkajs';
import { kafka } from 'src/configs/kafka';
import { OrderEntity } from 'src/models/entities/order.entity';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { AccountService } from 'src/modules/account/account.service';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { BaseEngineService } from 'src/modules/matching-engine/base-engine.service';
import { CommandCode } from 'src/modules/matching-engine/matching-engine.const';
import { CreateOrderDto } from 'src/modules/order/dto/create-order.dto';
import { MAX_RESULT_COUNT } from 'src/modules/trade/trade.const';
import { UserService } from 'src/modules/user/users.service';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { KafkaTopics } from 'src/shares/enums/kafka.enum';
import {
  CANCEL_ORDER_TYPE,
  ContractType,
  EOrderBy,
  OrderSide,
  OrderStatus,
  OrderTimeInForce,
  OrderType,
  ORDER_TPSL,
  TpSlType,
} from 'src/shares/enums/order.enum';
import { httpErrors } from 'src/shares/exceptions';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { getQueryLimit } from 'src/shares/pagination-util';
import { TakeProfitStopLossOrder } from './tp-sl.type';
import { In, LessThan, MoreThan, Like, getConnection, IsNull } from 'typeorm';
import { OrderHistoryDto } from './dto/order-history.dto';
import * as moment from 'moment';
import { OpenOrderDto } from './dto/open-order.dto';
import { UserMarginModeRepository } from 'src/models/repositories/user-margin-mode.repository';
import { IUserAccount } from './interface/account-user.interface';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { CANCEL_LIMIT_TYPES, CANCEL_STOP_TYPES, ENABLE_CREATE_ORDER } from './order.const';
import { UpdateTpSlOrderDto } from './dto/update-tpsl-order.dto';
import { TradeRepository } from 'src/models/repositories/trade.repository';
import { DEFAULT_LEVERAGE, DEFAULT_MARGIN_MODE } from '../user-margin-mode/user-marging-mode.const';
import { Cache } from 'cache-manager';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { AccountEntity } from 'src/models/entities/account.entity';
import { GET_NUMBER_RECORD, START_CRAWL } from '../transaction/transaction.const';
import { RedisService } from 'nestjs-redis';
import { ORACLE_PRICE_PREFIX } from '../index/index.const';
import { TradingRulesService } from '../trading-rules/trading-rule.service';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
import { MAX_PRICE, MIN_PRICE } from '../trading-rules/trading-rules.constants';
import { Ticker, TICKERS_KEY } from '../ticker/ticker.const';
import { UserRepository } from 'src/models/repositories/user.repository';

@Injectable()
export class OrderService extends BaseEngineService {
  constructor(
    public readonly logger: Logger,
    @InjectRepository(OrderRepository, 'report')
    public readonly orderRepoReport: OrderRepository,
    @InjectRepository(TradeRepository, 'report')
    public readonly tradeRepoReport: TradeRepository,
    @InjectRepository(OrderRepository, 'master')
    public readonly orderRepoMaster: OrderRepository,
    @InjectRepository(PositionRepository, 'report')
    public readonly positionRepoReport: PositionRepository,
    @InjectRepository(InstrumentRepository, 'report')
    public readonly instrumentRepoReport: InstrumentRepository,
    @InjectRepository(UserMarginModeRepository, 'report')
    public readonly userMarginModeRepoReport: UserMarginModeRepository,
    public readonly kafkaClient: KafkaClient,
    public readonly instrumentService: InstrumentService,
    public readonly accountService: AccountService,
    public readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(AccountRepository, 'report')
    public readonly accountRepoReport: AccountRepository,
    @InjectRepository(AccountRepository, 'master')
    public readonly accountRepoMaster: AccountRepository,
    private readonly redisService: RedisService,
    private readonly tradingRulesService: TradingRulesService,
    @InjectRepository(TradingRulesRepository, 'report')
    public readonly tradingRulesRepoReport: TradingRulesRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(UserRepository, 'report')
    public readonly userRepoReport: UserRepository,
  ) {
    super();
  }

  async getOpenOrderByAccountId(
    paging: PaginationDto,
    userId: number,
    openOrderDto: OpenOrderDto,
  ): Promise<ResponseDto<OrderEntity[]>> {
    const commonAndConditions = {
      userId: userId,
      status: In([OrderStatus.ACTIVE, OrderStatus.UNTRIGGERED]),
      isHidden: false,
      contractType: In([ContractType.COIN_M, ContractType.USD_M]),
    };
    const where = [];
    if (openOrderDto.contractType && openOrderDto.contractType !== ContractType.ALL) {
      commonAndConditions['contractType'] = In([openOrderDto.contractType]);
    }
    if (openOrderDto.symbol) {
      commonAndConditions['symbol'] = openOrderDto.symbol;
    }
    if (openOrderDto.side) {
      commonAndConditions['side'] = openOrderDto.side;
    }
    where.push(commonAndConditions);
    switch (openOrderDto.type) {
      case ORDER_TPSL.STOP_LOSS:
        where[0]['tpSLType'] = OrderType.STOP_MARKET;
        where[0]['isTpSlOrder'] = true;
        break;
      case ORDER_TPSL.TAKE_PROFIT:
        where[0]['tpSLType'] = OrderType.TAKE_PROFIT_MARKET;
        break;
      case OrderType.STOP_MARKET:
        where[0]['tpSLType'] = OrderType.STOP_MARKET;
        where[0]['isTpSlOrder'] = false;
        break;
      case OrderType.STOP_LIMIT:
        where[0]['tpSLType'] = OrderType.STOP_LIMIT;
        where[0]['status'] = OrderStatus.UNTRIGGERED;
        break;
      case OrderType.LIMIT:
      case OrderType.MARKET:
        where[0]['tpSLType'] = null;
        where[0]['type'] = openOrderDto.type;
        break;
      case undefined:
        break;
      case null:
        break;
      default:
        where.push({
          tpSLType: openOrderDto.type,
          ...commonAndConditions,
        });
        where[0]['type'] = openOrderDto.type;
        break;
    }
    const paginationOption = {};
    if (!openOrderDto.getAll) {
      paginationOption['skip'] = (paging.page - 1) * paging.size;
      paginationOption['take'] = paging.size;
    }
    const [orders, count] = await this.orderRepoReport.findAndCount({
      select: [
        'id',
        'createdAt',
        'type',
        'side',
        'quantity',
        'price',
        'trigger',
        'tpSLType',
        'tpSLPrice',
        'remaining',
        'activationPrice',
        'symbol',
        'timeInForce',
        'status',
        'takeProfitOrderId',
        'stopLossOrderId',
        'isHidden',
        'stopCondition',
        'isPostOnly',
        'cost',
        'parentOrderId',
        'isClosePositionOrder',
        'isTriggered',
        'isReduceOnly',
        'callbackRate',
        'isTpSlOrder',
        'contractType',
        'isTpSlTriggered',
        'updatedAt',
        'userEmail',
        'orderMargin',
        'originalCost',
        'originalOrderMargin',
      ],
      where: where,
      ...paginationOption,
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
    return {
      data: orders,
      metadata: {
        totalPage: Math.ceil(count / paging.size),
        totalItem: count,
      },
    };
  }

  async getOrderByAdmin(paging: PaginationDto, queries: AdminOrderDto): Promise<ResponseDto<OrderEntity[]>> {
    const startTime = moment(queries.from).format('YYYY-MM-DD 00:00:00');
    const endTime = moment(queries.to).format('YYYY-MM-DD 23:59:59');

    const commonAndConditions = {
      createdAt: MoreThan(startTime),
      updatedAt: LessThan(endTime),
    };
    const where = [];

    if (queries.isActive) {
      commonAndConditions['status'] = In([OrderStatus.ACTIVE, OrderStatus.UNTRIGGERED]);
    } else {
      const openStatuses = [OrderStatus.FILLED, OrderStatus.CANCELED];
      commonAndConditions['status'] = In(openStatuses);
    }

    if (queries.side) {
      commonAndConditions['side'] = queries.side;
    }

    if (queries.symbol) {
      commonAndConditions['symbol'] = Like(`%${queries.symbol}%`);
    }

    if (queries.contractType) {
      commonAndConditions['contractType'] = Like(`%${queries.contractType}%`);
    }
    where.push(commonAndConditions);
    if (queries.type) {
      switch (queries.type) {
        case ORDER_TPSL.STOP_LOSS:
          where[0]['tpSLType'] = OrderType.STOP_MARKET;
          where[0]['isTpSlOrder'] = true;
          break;
        case ORDER_TPSL.TAKE_PROFIT:
          where[0]['tpSLType'] = OrderType.TAKE_PROFIT_MARKET;
          break;
        case OrderType.STOP_MARKET:
          where[0]['tpSLType'] = OrderType.STOP_MARKET;
          where[0]['isTpSlOrder'] = false;
          break;
        case OrderType.LIMIT:
        case OrderType.MARKET:
          where[0]['tpSLType'] = null;
          where[0]['type'] = queries.type;
          break;
        case 'liquidation':
          where[0]['note'] = 'LIQUIDATION';
        case undefined:
          break;
        case null:
          break;
        default:
          where.push({
            tpSLType: queries.type,
            ...commonAndConditions,
          });
          where[0]['type'] = queries.type;
          break;
      }
    }

    const { offset, limit } = getQueryLimit(paging, MAX_RESULT_COUNT);
    const qb = this.orderRepoReport.createQueryBuilder('od');
    qb.select('od.*')
      .addSelect(
        "IF(od.status = 'ACTIVE' AND od.remaining != od.quantity, 'Partial_Filled', od.status)",
        'customStatus',
      )
      .addSelect(
        `CASE
        WHEN od.note = 'LIQUIDATION' THEN 'LIQUIDATION'
        WHEN od.type = 'MARKET 'AND od.tpSLType = 'TRAILING_STOP' THEN 'TRAILING_STOP'
        WHEN od.type = 'LIMIT' AND od.isPostOnly = '1' THEN 'POST_ONLY'
        WHEN od.type = 'LIMIT' AND od.tpSLType = 'STOP_LIMIT' THEN 'STOP_LIMIT'
        WHEN od.isTpSlOrder = '0' AND od.tpSLType = 'STOP_MARKET' THEN 'STOP_MARKET'
        WHEN od.type = 'LIMIT' THEN 'LIMIT'
        WHEN od.type = 'MARKET' THEN 'MARKET'
        END
      `,
        'customType',
      )
      .addSelect(`od.quantity - od.remaining`, 'customFilled')
      .where(where);
    if (queries.orderBy) {
      switch (queries.orderBy) {
        case EOrderBy.COST:
          qb.orderBy('od.cost', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.EMAIL:
          qb.orderBy('od.userEmail', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.FILLED:
          qb.orderBy('customFilled', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.LEVERAGE:
          qb.orderBy('od.leverage', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.PRICE:
          qb.orderBy('od.price', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.QUANTITY:
          qb.orderBy('od.quantity', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.SIDE:
          qb.orderBy('od.side', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.STATUS:
          qb.orderBy('customStatus', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.STOP_PRICE:
          qb.orderBy('od.tpSLPrice', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.SYMBOL:
          qb.orderBy('od.symbol', queries.direction ? queries.direction : 'DESC');
          break;
        case EOrderBy.TIME:
          qb.orderBy('od.createdAt', queries.direction ? queries.direction : 'DESC');
          break;
        default:
          break;
      }
    } else {
      qb.orderBy('od.createdAt', 'DESC');
    }
    qb.limit(limit).offset(offset);

    const [orders, count] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    return {
      data: orders,
      metadata: {
        totalPage: Math.ceil(count / paging.size),
        total: count,
      },
    };
  }

  async getOneOrder(orderId: number, userId: number): Promise<OrderEntity> {
    const order = await this.orderRepoReport.findOne({
      where: {
        id: orderId,
        userId: userId,
      },
    });
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async setCacheEnableOrDisableCreateOrder(status: boolean): Promise<void> {
    await this.cacheManager.set<boolean>(ENABLE_CREATE_ORDER, status, { ttl: 0 });
  }

  async createOrder(createOrderDto: CreateOrderDto, { accountId, userId, email }: IUserAccount): Promise<OrderEntity> {
    // if status = true => disable create order
    const checkStatusEnableCreateOrder = await this.cacheManager.get<boolean>(ENABLE_CREATE_ORDER);
    if (checkStatusEnableCreateOrder) {
      return;
    }
    const defaultLeverage = `${DEFAULT_LEVERAGE}`;
    const defaultMarginMode = DEFAULT_MARGIN_MODE;

    const instrument = await this.instrumentRepoReport.findOne({
      where: {
        symbol: createOrderDto.symbol,
      },
    });
    const marginMode = await this.userMarginModeRepoReport.findOne({
      where: {
        instrumentId: instrument.id,
        userId,
      },
    });
    const order = {
      ...createOrderDto,
      accountId,
      leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
      marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
      orderValue: '0',
      userId,
      contractType: instrument.contractType,
      isTpSlTriggered: false,
      userEmail: email ? email : null,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { side, trigger, orderValue, ...body } = createOrderDto;

    const tpSlOrder: TakeProfitStopLossOrder = {
      stopLossOrderId: null,
      takeProfitOrderId: null,
    };
    let stopLossOrder: OrderEntity;
    let takeProfitOrder: OrderEntity;
    if (body.stopLoss) {
      stopLossOrder = await this.orderRepoMaster.save({
        ...body,
        accountId,
        userId,
        side: order.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY,
        tpSLPrice: body.stopLoss,
        trigger: order.stopLossTrigger,
        orderValue: '0',
        tpSLType: TpSlType.STOP_MARKET,
        stopLoss: null,
        takeProfit: null,
        price: null,
        type: OrderType.MARKET,
        asset: order.asset,
        leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
        marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
        timeInForce: OrderTimeInForce.IOC,
        isHidden: true,
        stopCondition: order.stopLossCondition,
        isReduceOnly: true,
        isTpSlOrder: true,
        contractType: instrument.contractType,
        isPostOnly: false,
        userEmail: email ? email : null,
        originalCost: '0',
        originalOrderMargin: '0',
      });
      tpSlOrder.stopLossOrderId = stopLossOrder.id;
    }
    if (body.takeProfit) {
      takeProfitOrder = await this.orderRepoMaster.save({
        ...body,
        accountId: accountId,
        userId,
        side: side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY,
        tpSLPrice: body.takeProfit,
        trigger: order.takeProfitTrigger,
        orderValue: '0',
        tpSLType: TpSlType.TAKE_PROFIT_MARKET,
        stopLoss: null,
        takeProfit: null,
        price: null,
        type: OrderType.MARKET,
        asset: order.asset,
        leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
        marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
        timeInForce: OrderTimeInForce.IOC,
        isHidden: true,
        stopCondition: order.takeProfitCondition,
        isReduceOnly: true,
        isTpSlOder: true,
        contractType: instrument.contractType,
        isPostOnly: false,
        userEmail: email ? email : null,
        originalCost: '0',
        originalOrderMargin: '0',
      });
      tpSlOrder.takeProfitOrderId = takeProfitOrder.id;
    }
    const newOrder = await this.orderRepoMaster.save({
      ...order,
      ...tpSlOrder,
      originalCost: '0',
      originalOrderMargin: '0',
    });
    this.removeEmptyValues(newOrder);
    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.PLACE_ORDER,
      data: plainToClass(OrderEntity, newOrder),
    });
    if (body.stopLoss) {
      this.removeEmptyValues(stopLossOrder);
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.PLACE_ORDER,
        data: plainToClass(OrderEntity, {
          ...stopLossOrder,
          linkedOrderId: tpSlOrder.takeProfitOrderId ? tpSlOrder.takeProfitOrderId : null,
          parentOrderId: newOrder.id,
        }),
      });
    }
    if (body.takeProfit) {
      this.removeEmptyValues(takeProfitOrder);
      await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
        code: CommandCode.PLACE_ORDER,
        data: plainToClass(OrderEntity, {
          ...takeProfitOrder,
          linkedOrderId: tpSlOrder.stopLossOrderId ? tpSlOrder.stopLossOrderId : null,
          parentOrderId: newOrder.id,
        }),
      });
    }
    return newOrder;
  }
  async getRootOrder(accountId: number, orderId: number, type: ORDER_TPSL): Promise<OrderEntity> {
    const where = {
      accountId: accountId,
    };
    if (type == ORDER_TPSL.STOP_LOSS) {
      where['stopLossOrderId'] = orderId;
    }
    if (type == ORDER_TPSL.TAKE_PROFIT) {
      where['takeProfitOrderId'] = orderId;
    }
    const order = await this.orderRepoReport.findOne({
      select: [
        'price',
        'quantity',
        'quantity',
        'id',
        'side',
        'tpSLPrice',
        'type',
        'isReduceOnly',
        'trigger',
        'remaining',
      ],
      where: where,
    });
    return order;
  }
  async findOrderBatch(status: OrderStatus, fromId: number, count: number): Promise<OrderEntity[]> {
    return await this.orderRepoMaster.findOrderBatch(status, fromId, count);
  }

  async findAccountOrderBatch(
    userId: number,
    status: OrderStatus,
    fromId: number,
    count: number,
    types: string[],
    cancelOrderType: CANCEL_ORDER_TYPE,
    contractType: ContractType,
  ): Promise<OrderEntity[]> {
    return await this.orderRepoReport.findAccountOrderBatch(
      userId,
      status,
      fromId,
      count,
      types,
      cancelOrderType,
      contractType,
    );
  }

  async cancelOrder(orderId: number, userId: number): Promise<OrderEntity> {
    const canceledOrder = await this.orderRepoReport.findOne({
      where: {
        id: orderId,
        userId: userId,
        status: In([OrderStatus.ACTIVE, OrderStatus.PENDING, OrderStatus.UNTRIGGERED]),
      },
    });
    if (!canceledOrder) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.CANCEL_ORDER,
      data: canceledOrder,
    });
    return canceledOrder;
  }

  async cancelAllOrder(
    userId: number,
    cancelOrderType: CANCEL_ORDER_TYPE,
    contractType: ContractType,
  ): Promise<OrderEntity[]> {
    const statuses = [OrderStatus.ACTIVE, OrderStatus.PENDING, OrderStatus.UNTRIGGERED];
    let types: any = [];
    switch (cancelOrderType) {
      case CANCEL_ORDER_TYPE.LIMIT:
        types = CANCEL_LIMIT_TYPES;
        break;
      case CANCEL_ORDER_TYPE.STOP:
        types = CANCEL_STOP_TYPES;
        break;
      case CANCEL_ORDER_TYPE.ALL:
        types = [...CANCEL_STOP_TYPES, OrderType.LIMIT];
        break;
      default:
        break;
    }
    return await this.sendDataCancelToKafka(statuses, userId, types, cancelOrderType, contractType);
  }

  async sendDataCancelToKafka(
    statuses: OrderStatus[],
    userId: number,
    types: string[],
    cancelOrderType: CANCEL_ORDER_TYPE,
    contractType: ContractType,
  ) {
    const producer = kafka.producer();
    await producer.connect();
    for (const status of statuses) {
      await this.cancelOrderByStatus(userId, status, producer, types, cancelOrderType, contractType);
    }
    await producer.disconnect();
    return [];
  }

  async cancelOrderByStatus(
    userId: number,
    status: OrderStatus,
    producer: Producer,
    types: string[],
    cancelOrderType: CANCEL_ORDER_TYPE,
    contractType: ContractType,
  ): Promise<void> {
    const loader = async (fromId: number, size: number): Promise<OrderEntity[]> => {
      return await this.findAccountOrderBatch(userId, status, fromId, size, types, cancelOrderType, contractType);
    };
    await this.loadData(producer, loader, CommandCode.CANCEL_ORDER, KafkaTopics.matching_engine_input);
  }

  async getLastOrderId(): Promise<number> {
    return await this.orderRepoMaster.getLastId();
  }

  async getHistoryOrders(userId: number, paging: PaginationDto, orderHistoryDto: OrderHistoryDto) {
    const startTime = moment(orderHistoryDto.startTime).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(orderHistoryDto.endTime).format('YYYY-MM-DD HH:mm:ss');
    const [{ orders, count }, { tradeBuy, tradeSell }] = await Promise.all([
      this.orderRepoReport.getOrderHistory(orderHistoryDto, startTime, endTime, userId, paging),
      this.tradeRepoReport.getDataTrade(userId, orderHistoryDto.symbol, orderHistoryDto.contractType),
    ]);

    for (const order of orders) {
      let trade;
      switch (order.side) {
        case OrderSide.BUY:
          trade = tradeBuy.find((trade) => trade.buyOrderId == order.id);
          break;
        case OrderSide.SELL:
          trade = tradeSell.find((trade) => trade.sellOrderId == order.id);
          break;
        default:
          break;
      }
      if (trade) {
        order['average'] = trade.average;
      }
    }
    // for (const order of orders) {
    //   if (order.side == OrderSide.BUY) {
    //     const trade = tradeBuy.find((trade) => trade.buyOrderId == order.id);
    //     if (trade) {
    //       order['average'] = trade.average;
    //     }
    //   }

    //   if (order.side == OrderSide.SELL) {
    //     const trade = tradeSell.find((trade) => trade.sellOrderId == order.id);
    //     if (trade) {
    //       order['average'] = trade.average;
    //     }
    //   }
    // }

    return {
      data: orders,
      metadata: {
        totalPage: Math.ceil(count / paging.size),
      },
    };
  }

  async validateOrder(createOrder: CreateOrderDto): Promise<CreateOrderDto> {
    const order = { ...createOrder };
    order.remaining = order.quantity;
    order.status = OrderStatus.PENDING;
    order.timeInForce = order.timeInForce || OrderTimeInForce.GTC;

    const tradingRule = await this.instrumentService.getTradingRuleBySymbol(order.symbol);
    const { maxFiguresForPrice, maxFiguresForSize } = await this.instrumentService.findBySymbol(order.symbol);
    const num = parseInt('1' + '0'.repeat(+maxFiguresForSize));

    const minimumQty = new BigNumber(`${(1 / num).toFixed(+maxFiguresForSize)}`);
    const maximumQty = new BigNumber(tradingRule.maxOrderAmount);

    // FOR ALL ORDER TYPE VALIDATION
    // validate minimum quantity
    if (minimumQty.gt(order.quantity)) {
      throw new HttpException(httpErrors.ORDER_MINIMUM_QUANTITY_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
    }
    // validate maximum quantity
    if (maximumQty.lt(order.quantity)) {
      throw new HttpException(httpErrors.ORDER_MAXIMUM_QUANTITY_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
    }

    // validate precision
    if (this.validatePrecision(order.quantity, maxFiguresForSize)) {
      throw new HttpException(httpErrors.ORDER_QUANTITY_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
    }
    if (order.price) {
      if (this.validatePrecision(order.price, maxFiguresForPrice)) {
        throw new HttpException(httpErrors.ORDER_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }
    }
    await this.validateMinMaxPrice(createOrder);
    // TPSL
    let checkPrice;
    if (order.type === OrderType.MARKET && !order.tpSLType) {
      const tickers = await this.cacheService.get<Ticker[]>(TICKERS_KEY);
      const ticker = tickers.find((ticker) => ticker.symbol === order.symbol);
      checkPrice = ticker?.lastPrice ?? null;
    } else if (order.type === OrderType.MARKET && order.tpSLType === TpSlType.STOP_MARKET) {
      checkPrice = order.tpSLPrice;
    }
    if (order.takeProfit || order.takeProfitTrigger) {
      if (order.takeProfit && order.takeProfitTrigger) {
        if (order.side == OrderSide.BUY && Number(order.takeProfit) <= Number(checkPrice)) {
          throw new HttpException(httpErrors.TAKE_PROFIT_TRIGGER_OR_PRICE_NOT_VALID, HttpStatus.BAD_REQUEST);
        }
        if (order.side == OrderSide.SELL && Number(order.takeProfit) >= Number(checkPrice)) {
          throw new HttpException(httpErrors.TAKE_PROFIT_TRIGGER_OR_PRICE_NOT_VALID, HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException(httpErrors.TAKE_PROFIT_TRIGGER_OR_PRICE_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
      if (!order.takeProfitCondition) {
        throw new HttpException(httpErrors.TAKE_PROFIT_CONDITION_UNDEFINED, HttpStatus.BAD_REQUEST);
      }
    }
    if (order.stopLoss || order.stopLossTrigger) {
      if (order.stopLoss && order.stopLossTrigger) {
        if (order.side == OrderSide.BUY && Number(order.stopLoss) >= Number(checkPrice)) {
          throw new HttpException(httpErrors.STOP_LOSS_TRIGGER_OR_PRICE_NOT_VALID, HttpStatus.BAD_REQUEST);
        }
        if (order.side == OrderSide.SELL && Number(order.stopLoss) <= Number(checkPrice)) {
          throw new HttpException(httpErrors.STOP_LOSS_TRIGGER_OR_PRICE_NOT_VALID, HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException(httpErrors.STOP_LOSS_TRIGGER_OR_PRICE_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
      if (!order.stopLossCondition) {
        throw new HttpException(httpErrors.STOP_LOSS_CONDITION_UNDEFINED, HttpStatus.BAD_REQUEST);
      }
    }
    // TRAILING_STOP
    if (order.tpSLType == TpSlType.TRAILING_STOP) {
      order.type = OrderType.MARKET;
      delete order.price;
      order.timeInForce = OrderTimeInForce.IOC;
      delete order.isPostOnly;
      delete order.isHidden;
      delete order.takeProfit;
      delete order.takeProfitTrigger;
      delete order.stopLoss;
      delete order.stopLossTrigger;
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.activationPrice || new BigNumber(order.activationPrice).lte(0))
        throw new HttpException(httpErrors.ORDER_ACTIVATION_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.callbackRate) {
        throw new HttpException(httpErrors.CALLBACK_RATE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }
      if (this.validatePrecision(order.activationPrice, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_TRAIL_VALUE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (order.type !== OrderType.MARKET) {
        throw new HttpException(httpErrors.TRAILING_STOP_ORDER_TYPE_NOT_VALID, HttpStatus.BAD_REQUEST);
      }
      return order;
    }

    // POST_ONLY
    if (order.type === OrderType.LIMIT && order.isPostOnly) {
      order.timeInForce = OrderTimeInForce.GTC;
      delete order.isHidden;
      if ((order.stopLoss || order.takeProfit) && !order.trigger)
        throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      return order;
    }

    // STOP_LIMIT
    if (order.type == OrderType.LIMIT && order.tpSLType == TpSlType.STOP_LIMIT) {
      if (!order.price) throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.tpSLPrice || new BigNumber(order.tpSLPrice).eq(0))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.stopCondition) {
        throw new HttpException(httpErrors.NOT_HAVE_STOP_CONDITION, HttpStatus.BAD_REQUEST);
      }
      if (this.validatePrecision(order.tpSLPrice, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      delete order.activationPrice;
      return order;
    }

    // STOP_MARKET
    if (order.type == OrderType.MARKET && order.tpSLType == TpSlType.STOP_MARKET) {
      delete order.price;
      order.timeInForce = OrderTimeInForce.IOC;
      delete order.isPostOnly;
      delete order.isHidden;
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.tpSLPrice || new BigNumber(order.tpSLPrice).eq(0))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (this.validatePrecision(order.tpSLPrice, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.stopCondition) {
        throw new HttpException(httpErrors.NOT_HAVE_STOP_CONDITION, HttpStatus.BAD_REQUEST);
      }
      delete order.activationPrice;
      return order;
    }

    // TAKE_PROFIT_LIMIT
    if (order.type == OrderType.LIMIT && order.takeProfit && new BigNumber(order.takeProfit).gt(0)) {
      if (!order.price || new BigNumber(order.price).eq(0))
        throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.takeProfit || new BigNumber(order.takeProfit).eq(0))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (this.validatePrecision(order.takeProfit, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      delete order.activationPrice;
      return order;
    }
    //STOP_LOSS_LIMIT
    if (order.type == OrderType.LIMIT && order.stopLoss && new BigNumber(order.stopLoss).gt(0)) {
      if (!order.price || new BigNumber(order.price).eq(0))
        throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.stopLoss || new BigNumber(order.stopLoss).eq(0))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (this.validatePrecision(order.stopLoss, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      delete order.activationPrice;
      return order;
    }
    // TAKE_PROFIT_MARKET
    if (order.type == OrderType.MARKET && order.takeProfit && new BigNumber(order.takeProfit).gt(0)) {
      delete order.price;
      order.timeInForce = OrderTimeInForce.IOC;
      delete order.isPostOnly;
      delete order.isHidden;
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.takeProfit || new BigNumber(order.takeProfit).eq(0))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (this.validatePrecision(order.takeProfit, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      delete order.activationPrice;
      return order;
    }
    // STOP_LOSS_MARKET
    if (order.type == OrderType.MARKET && order.stopLoss && new BigNumber(order.stopLoss).gt(0)) {
      delete order.price;
      order.timeInForce = OrderTimeInForce.IOC;
      delete order.isPostOnly;
      delete order.isHidden;
      if (!order.trigger) throw new HttpException(httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (!order.stopLoss || new BigNumber(order.stopLoss).eq(0))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      if (this.validatePrecision(order.stopLoss, maxFiguresForPrice))
        throw new HttpException(httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      delete order.activationPrice;
      return order;
    }
    // LIMIT
    if (order.type == OrderType.LIMIT) {
      if (!order.price) throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      delete order.trigger;
      delete order.activationPrice;
      return order;
    }

    // MARKET
    if (order.type == OrderType.MARKET) {
      delete order.price;
      order.timeInForce = OrderTimeInForce.IOC;
      delete order.isPostOnly;
      delete order.isHidden;
      delete order.trigger;
      delete order.activationPrice;
      return order;
    }

    this.logger.debug('ORDER_UNKNOWN_VALIDATION_FAIL');
    this.logger.debug(createOrder);
    this.logger.debug(order);
    throw new HttpException(httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
  }

  validatePrecision(value: string | BigNumber, precision: string | BigNumber): boolean {
    const numberOfDecimalFigures = value.toString().split('.')[1];
    if (!numberOfDecimalFigures) {
      return false;
    }
    return numberOfDecimalFigures.length > +precision.toString();
    // return new BigNumber(value).dividedToIntegerBy(precision).multipliedBy(precision).lt(new BigNumber(value));
  }

  async validateMinMaxPrice(createOrderDto: CreateOrderDto) {
    const order = { ...createOrderDto };
    const [tradingRules, instrument, markPrice] = await Promise.all([
      this.tradingRulesService.getTradingRuleByInstrumentId(order.symbol) as any,
      this.instrumentRepoReport.findOne({ where: { symbol: order.symbol } }),
      this.redisService.getClient().get(`${ORACLE_PRICE_PREFIX}${order.symbol}`),
    ]);
    let price: BigNumber;
    let minPrice: BigNumber;
    let maxPrice: BigNumber;
    switch (order.side) {
      case OrderSide.SELL: {
        // validate minPrice
        maxPrice = new BigNumber(instrument?.maxPrice);
        minPrice = new BigNumber(tradingRules?.minPrice);
        if ((order.type == OrderType.LIMIT && !order.tpSLType) || order.isPostOnly == true) {
          price = new BigNumber(markPrice).times(
            new BigNumber(1).minus(new BigNumber(tradingRules?.floorRatio).dividedBy(100)),
          );
          minPrice = BigNumber.maximum(new BigNumber(tradingRules?.minPrice), price);
        }

        if (order.tpSLType == TpSlType.STOP_LIMIT) {
          price = new BigNumber(order.tpSLPrice).times(
            new BigNumber(1).minus(new BigNumber(tradingRules?.floorRatio).dividedBy(100)),
          );
          minPrice = BigNumber.maximum(new BigNumber(tradingRules?.minPrice), price);
        }
        if (new BigNumber(order.price).isLessThan(minPrice))
          throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
        // validate max Price:
        if (new BigNumber(order.price).isGreaterThan(instrument.maxPrice)) {
          throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
        }
        break;
      }
      //limitOrderPrice = cap ratio
      case OrderSide.BUY: {
        maxPrice = new BigNumber(instrument?.maxPrice);
        minPrice = new BigNumber(tradingRules?.minPrice);
        if ((order.type == OrderType.LIMIT && !order.tpSLType) || order.isPostOnly == true) {
          price = new BigNumber(markPrice).times(
            new BigNumber(1).plus(new BigNumber(tradingRules?.limitOrderPrice).dividedBy(100)),
          );
          maxPrice = BigNumber.minimum((new BigNumber(instrument?.maxPrice), price));
        }
        if (order.tpSLType == TpSlType.STOP_LIMIT) {
          price = new BigNumber(order.tpSLPrice).times(
            new BigNumber(1).plus(new BigNumber(tradingRules?.limitOrderPrice).dividedBy(100)),
          );
          maxPrice = BigNumber.minimum((new BigNumber(instrument?.maxPrice), price));
        }
        if (new BigNumber(order.price).isLessThan(minPrice))
          throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
        if (new BigNumber(order.price).isGreaterThan(maxPrice))
          throw new HttpException(httpErrors.ORDER_PRICE_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
        break;
      }
      default:
        break;
    }
  }

  async getTpSlOrder(rootOrderId: number) {
    const rootOrder = await this.orderRepoReport.findOne({
      where: {
        id: +rootOrderId,
      },
    });
    if (!rootOrder || (!rootOrder.takeProfitOrderId && !rootOrder.stopLossOrderId)) {
      return new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const [tpOrder, slOrder] = await Promise.all([
      this.orderRepoReport.findOne({
        where: {
          id: rootOrder.takeProfitOrderId,
        },
      }),
      this.orderRepoReport.findOne({
        where: {
          id: rootOrder.stopLossOrderId,
        },
      }),
    ]);
    return {
      rootOrder,
      tpOrder,
      slOrder,
    };
  }

  async updateTpSlOrder(userId: number, updateTpSlOrder: UpdateTpSlOrderDto[], rootOrderId: number): Promise<void> {
    if (updateTpSlOrder.length === 0) {
      return;
    }
    const rootOrder = await this.orderRepoReport.findOne(rootOrderId);
    if (!rootOrder) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const maxPrice = await this.cacheManager.get(`${MAX_PRICE}_${rootOrder.symbol}`);
    let minPrice = await this.cacheManager.get(`${MIN_PRICE}_${rootOrder.symbol}`);
    if (!maxPrice) {
      const instrument = await this.instrumentRepoReport.findOne({ symbol: rootOrder.symbol }),
        maxPrice = instrument.maxPrice;
      await this.cacheManager.set(`${MAX_PRICE}_${rootOrder.symbol}`, maxPrice, { ttl: Number.MAX_SAFE_INTEGER });
    }
    if (!minPrice) {
      const tradingRule = await this.tradingRulesRepoReport.findOne({ symbol: rootOrder.symbol });
      minPrice = tradingRule.minPrice;
      await this.cacheManager.set(`${MIN_PRICE}_${rootOrder.symbol}`, minPrice, { ttl: Number.MAX_SAFE_INTEGER });
    }

    const tpSlOrder = {
      tpOrderId: null,
      slOrderId: null,
      tpOrderChangePrice: null,
      slOrderChangePrice: null,
      tpOrderTrigger: null,
      slOrderTrigger: null,
    };
    const checkPrice = rootOrder.price ? +rootOrder.price : +rootOrder.tpSLPrice;
    for (const element of updateTpSlOrder) {
      const { orderId, ...dataUpdate } = element;
      const isExistOrder = await this.orderRepoReport.findOne({ id: orderId, userId });
      if (!isExistOrder) {
        throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      if (+element.tpSLPrice < minPrice || +element.tpSLPrice > maxPrice) {
        throw new HttpException(httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }
      if (
        rootOrder.side == OrderSide.BUY &&
        isExistOrder.tpSLType === TpSlType.TAKE_PROFIT_MARKET &&
        +dataUpdate.tpSLPrice <= checkPrice
      ) {
        throw new HttpException(httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }
      if (
        rootOrder.side == OrderSide.BUY &&
        isExistOrder.tpSLType === TpSlType.STOP_MARKET &&
        +dataUpdate.tpSLPrice >= checkPrice
      ) {
        throw new HttpException(httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }

      if (
        rootOrder.side == OrderSide.SELL &&
        isExistOrder.tpSLType === TpSlType.TAKE_PROFIT_MARKET &&
        +dataUpdate.tpSLPrice >= checkPrice
      ) {
        throw new HttpException(httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }

      if (
        rootOrder.side == OrderSide.SELL &&
        isExistOrder.tpSLType === TpSlType.STOP_MARKET &&
        +dataUpdate.tpSLPrice <= checkPrice
      ) {
        throw new HttpException(httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, HttpStatus.BAD_REQUEST);
      }
      if (isExistOrder.tpSLType === TpSlType.TAKE_PROFIT_MARKET) {
        tpSlOrder.tpOrderId = isExistOrder.id;
        tpSlOrder.tpOrderChangePrice = dataUpdate.tpSLPrice;
        tpSlOrder.tpOrderTrigger = dataUpdate.trigger === isExistOrder.trigger ? null : dataUpdate.trigger;
      }
      if (isExistOrder.tpSLType === TpSlType.STOP_MARKET) {
        tpSlOrder.slOrderId = isExistOrder.id;
        tpSlOrder.slOrderChangePrice = dataUpdate.tpSLPrice;
        tpSlOrder.slOrderTrigger = dataUpdate.trigger === isExistOrder.trigger ? null : dataUpdate.trigger;
      }
    }
    await this.kafkaClient.send(KafkaTopics.matching_engine_input, {
      code: CommandCode.ADJUST_TP_SL_PRICE,
      data: {
        ...tpSlOrder,
      },
    });
  }

  private removeEmptyValues(object: OrderEntity): void {
    for (const key in object) {
      if (key !== 'userEmail' && object.hasOwnProperty(key)) {
        const value = object[key];
        if (value === null || value === undefined || value === '') {
          delete object[key];
        }
      }
    }
  }

  async calOrderMargin(accountId: number, asset: string) {
    try {
      const result = await this.orderRepoReport
        .createQueryBuilder('o')
        .where('o.asset = :asset', { asset })
        .andWhere('o.accountId = :accountId', { accountId })
        .andWhere('o.status IN (:status)', {
          status: [OrderStatus.ACTIVE, OrderStatus.UNTRIGGERED],
        })
        .select('SUM(o.cost) as totalCost')
        .getRawOne();

      return result.totalCost ? result.totalCost : 0;
    } catch (error) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async updateUserIdInOrder(): Promise<void> {
    let skip = START_CRAWL;
    const take = GET_NUMBER_RECORD;
    do {
      const orders = await this.orderRepoReport.find({
        where: {
          userId: IsNull(),
        },
        skip,
        take,
      });

      skip += take;

      if (orders.length) {
        for (const o of orders) {
          const user = await getConnection('report').getRepository(AccountEntity).findOne({
            id: o.accountId,
          });

          if (!user) continue;
          await this.orderRepoMaster.update({ accountId: user.id }, { userId: user.userId });

          const newAccount = await this.accountRepoReport.findOne({
            userId: user.userId,
            asset: o.asset.toLowerCase(),
          });
          await this.orderRepoMaster.update({ userId: newAccount.userId }, { accountId: newAccount.id });
        }
      } else {
        break;
      }
    } while (true);
  }

  async updateUserEmailInOrder(): Promise<void> {
    let skip = 0;
    const take = GET_NUMBER_RECORD;
    do {
      const ordersUpdate = await this.orderRepoReport.find({
        where: { userEmail: IsNull() },
        skip,
        take,
      });
      skip += take;
      if (ordersUpdate.length > 0) {
        const task = [];
        for (const order of ordersUpdate) {
          const user = await this.userRepoReport.findOne({ where: { id: order.userId } });
          if (!user) {
            continue;
          }
          task.push(
            this.orderRepoMaster.update(
              { id: order.id },
              {
                userEmail: user.email ? user.email : null,
                createdAt: () => `orders.createdAt`,
                updatedAt: () => `orders.updatedAt`,
              },
            ),
          );
        }
        await Promise.all([...task]);
      } else {
        break;
      }
    } while (true);
  }
}
