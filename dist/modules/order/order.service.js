"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bignumber_js_1 = require("bignumber.js");
const class_transformer_1 = require("class-transformer");
const kafka_1 = require("../../configs/kafka");
const order_entity_1 = require("../../models/entities/order.entity");
const order_repository_1 = require("../../models/repositories/order.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const account_service_1 = require("../account/account.service");
const instrument_service_1 = require("../instrument/instrument.service");
const base_engine_service_1 = require("../matching-engine/base-engine.service");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const create_order_dto_1 = require("./dto/create-order.dto");
const trade_const_1 = require("../trade/trade.const");
const users_service_1 = require("../user/users.service");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const order_enum_1 = require("../../shares/enums/order.enum");
const exceptions_1 = require("../../shares/exceptions");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const pagination_util_1 = require("../../shares/pagination-util");
const typeorm_2 = require("typeorm");
const moment = require("moment");
const user_margin_mode_repository_1 = require("../../models/repositories/user-margin-mode.repository");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const order_const_1 = require("./order.const");
const trade_repository_1 = require("../../models/repositories/trade.repository");
const user_marging_mode_const_1 = require("../user-margin-mode/user-marging-mode.const");
const account_repository_1 = require("../../models/repositories/account.repository");
const account_entity_1 = require("../../models/entities/account.entity");
const transaction_const_1 = require("../transaction/transaction.const");
const nestjs_redis_1 = require("nestjs-redis");
const index_const_1 = require("../index/index.const");
const trading_rule_service_1 = require("../trading-rules/trading-rule.service");
const trading_rules_repository_1 = require("../../models/repositories/trading-rules.repository");
const trading_rules_constants_1 = require("../trading-rules/trading-rules.constants");
const ticker_const_1 = require("../ticker/ticker.const");
const user_repository_1 = require("../../models/repositories/user.repository");
let OrderService = class OrderService extends base_engine_service_1.BaseEngineService {
    constructor(logger, orderRepoReport, tradeRepoReport, orderRepoMaster, positionRepoReport, instrumentRepoReport, userMarginModeRepoReport, kafkaClient, instrumentService, accountService, userService, cacheManager, accountRepoReport, accountRepoMaster, redisService, tradingRulesService, tradingRulesRepoReport, cacheService, userRepoReport) {
        super();
        this.logger = logger;
        this.orderRepoReport = orderRepoReport;
        this.tradeRepoReport = tradeRepoReport;
        this.orderRepoMaster = orderRepoMaster;
        this.positionRepoReport = positionRepoReport;
        this.instrumentRepoReport = instrumentRepoReport;
        this.userMarginModeRepoReport = userMarginModeRepoReport;
        this.kafkaClient = kafkaClient;
        this.instrumentService = instrumentService;
        this.accountService = accountService;
        this.userService = userService;
        this.cacheManager = cacheManager;
        this.accountRepoReport = accountRepoReport;
        this.accountRepoMaster = accountRepoMaster;
        this.redisService = redisService;
        this.tradingRulesService = tradingRulesService;
        this.tradingRulesRepoReport = tradingRulesRepoReport;
        this.cacheService = cacheService;
        this.userRepoReport = userRepoReport;
    }
    async getOpenOrderByAccountId(paging, userId, openOrderDto) {
        const commonAndConditions = {
            userId: userId,
            status: typeorm_2.In([order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED]),
            isHidden: false,
            contractType: typeorm_2.In([order_enum_1.ContractType.COIN_M, order_enum_1.ContractType.USD_M]),
        };
        const where = [];
        if (openOrderDto.contractType && openOrderDto.contractType !== order_enum_1.ContractType.ALL) {
            commonAndConditions['contractType'] = typeorm_2.In([openOrderDto.contractType]);
        }
        if (openOrderDto.symbol) {
            commonAndConditions['symbol'] = openOrderDto.symbol;
        }
        if (openOrderDto.side) {
            commonAndConditions['side'] = openOrderDto.side;
        }
        where.push(commonAndConditions);
        switch (openOrderDto.type) {
            case order_enum_1.ORDER_TPSL.STOP_LOSS:
                where[0]['tpSLType'] = order_enum_1.OrderType.STOP_MARKET;
                where[0]['isTpSlOrder'] = true;
                break;
            case order_enum_1.ORDER_TPSL.TAKE_PROFIT:
                where[0]['tpSLType'] = order_enum_1.OrderType.TAKE_PROFIT_MARKET;
                break;
            case order_enum_1.OrderType.STOP_MARKET:
                where[0]['tpSLType'] = order_enum_1.OrderType.STOP_MARKET;
                where[0]['isTpSlOrder'] = false;
                break;
            case order_enum_1.OrderType.STOP_LIMIT:
                where[0]['tpSLType'] = order_enum_1.OrderType.STOP_LIMIT;
                where[0]['status'] = order_enum_1.OrderStatus.UNTRIGGERED;
                break;
            case order_enum_1.OrderType.LIMIT:
            case order_enum_1.OrderType.MARKET:
                where[0]['tpSLType'] = null;
                where[0]['type'] = openOrderDto.type;
                break;
            case undefined:
                break;
            case null:
                break;
            default:
                where.push(Object.assign({ tpSLType: openOrderDto.type }, commonAndConditions));
                where[0]['type'] = openOrderDto.type;
                break;
        }
        const paginationOption = {};
        if (!openOrderDto.getAll) {
            paginationOption['skip'] = (paging.page - 1) * paging.size;
            paginationOption['take'] = paging.size;
        }
        const [orders, count] = await this.orderRepoReport.findAndCount(Object.assign(Object.assign({ select: [
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
            ], where: where }, paginationOption), { order: {
                createdAt: 'DESC',
                id: 'DESC',
            } }));
        return {
            data: orders,
            metadata: {
                totalPage: Math.ceil(count / paging.size),
                totalItem: count,
            },
        };
    }
    async getOrderByAdmin(paging, queries) {
        const startTime = moment(queries.from).format('YYYY-MM-DD 00:00:00');
        const endTime = moment(queries.to).format('YYYY-MM-DD 23:59:59');
        const commonAndConditions = {
            createdAt: typeorm_2.MoreThan(startTime),
            updatedAt: typeorm_2.LessThan(endTime),
        };
        const where = [];
        if (queries.isActive) {
            commonAndConditions['status'] = typeorm_2.In([order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED]);
        }
        else {
            const openStatuses = [order_enum_1.OrderStatus.FILLED, order_enum_1.OrderStatus.CANCELED];
            commonAndConditions['status'] = typeorm_2.In(openStatuses);
        }
        if (queries.side) {
            commonAndConditions['side'] = queries.side;
        }
        if (queries.symbol) {
            commonAndConditions['symbol'] = typeorm_2.Like(`%${queries.symbol}%`);
        }
        if (queries.contractType) {
            commonAndConditions['contractType'] = typeorm_2.Like(`%${queries.contractType}%`);
        }
        where.push(commonAndConditions);
        if (queries.type) {
            switch (queries.type) {
                case order_enum_1.ORDER_TPSL.STOP_LOSS:
                    where[0]['tpSLType'] = order_enum_1.OrderType.STOP_MARKET;
                    where[0]['isTpSlOrder'] = true;
                    break;
                case order_enum_1.ORDER_TPSL.TAKE_PROFIT:
                    where[0]['tpSLType'] = order_enum_1.OrderType.TAKE_PROFIT_MARKET;
                    break;
                case order_enum_1.OrderType.STOP_MARKET:
                    where[0]['tpSLType'] = order_enum_1.OrderType.STOP_MARKET;
                    where[0]['isTpSlOrder'] = false;
                    break;
                case order_enum_1.OrderType.LIMIT:
                case order_enum_1.OrderType.MARKET:
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
                    where.push(Object.assign({ tpSLType: queries.type }, commonAndConditions));
                    where[0]['type'] = queries.type;
                    break;
            }
        }
        const { offset, limit } = pagination_util_1.getQueryLimit(paging, trade_const_1.MAX_RESULT_COUNT);
        const qb = this.orderRepoReport.createQueryBuilder('od');
        qb.select('od.*')
            .addSelect("IF(od.status = 'ACTIVE' AND od.remaining != od.quantity, 'Partial_Filled', od.status)", 'customStatus')
            .addSelect(`CASE
        WHEN od.note = 'LIQUIDATION' THEN 'LIQUIDATION'
        WHEN od.type = 'MARKET 'AND od.tpSLType = 'TRAILING_STOP' THEN 'TRAILING_STOP'
        WHEN od.type = 'LIMIT' AND od.isPostOnly = '1' THEN 'POST_ONLY'
        WHEN od.type = 'LIMIT' AND od.tpSLType = 'STOP_LIMIT' THEN 'STOP_LIMIT'
        WHEN od.isTpSlOrder = '0' AND od.tpSLType = 'STOP_MARKET' THEN 'STOP_MARKET'
        WHEN od.type = 'LIMIT' THEN 'LIMIT'
        WHEN od.type = 'MARKET' THEN 'MARKET'
        END
      `, 'customType')
            .where(where);
        if (queries.orderBy) {
            switch (queries.orderBy) {
                case order_enum_1.EOrderBy.COST:
                    qb.orderBy('od.cost', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.EMAIL:
                    qb.orderBy('od.userEmail', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.FILLED:
                    qb.orderBy('od.remaining', queries.direction ? (queries.direction === order_enum_1.EDirection.DESC ? 'ASC' : 'DESC') : 'ASC');
                    break;
                case order_enum_1.EOrderBy.LEVERAGE:
                    qb.orderBy('od.leverage', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.PRICE:
                    qb.orderBy('od.price', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.QUANTITY:
                    qb.orderBy('od.quantity', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.SIDE:
                    qb.orderBy('od.side', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.STATUS:
                    qb.orderBy('customStatus', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.STOP_PRICE:
                    qb.orderBy('od.tpSLPrice', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.SYMBOL:
                    qb.orderBy('od.symbol', queries.direction ? queries.direction : 'DESC');
                    break;
                case order_enum_1.EOrderBy.TIME:
                    qb.orderBy('od.createdAt', queries.direction ? queries.direction : 'DESC');
                    break;
                default:
                    break;
            }
        }
        else {
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
    async getOneOrder(orderId, userId) {
        const order = await this.orderRepoReport.findOne({
            where: {
                id: orderId,
                userId: userId,
            },
        });
        if (!order) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        return order;
    }
    async setCacheEnableOrDisableCreateOrder(status) {
        await this.cacheManager.set(order_const_1.ENABLE_CREATE_ORDER, status, { ttl: 0 });
    }
    async createOrder(createOrderDto, { accountId, userId, email }) {
        const checkStatusEnableCreateOrder = await this.cacheManager.get(order_const_1.ENABLE_CREATE_ORDER);
        if (checkStatusEnableCreateOrder) {
            return;
        }
        const defaultLeverage = `${user_marging_mode_const_1.DEFAULT_LEVERAGE}`;
        const defaultMarginMode = user_marging_mode_const_1.DEFAULT_MARGIN_MODE;
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
        const order = Object.assign(Object.assign({}, createOrderDto), { accountId, leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`, marginMode: marginMode ? marginMode.marginMode : defaultMarginMode, orderValue: '0', userId, contractType: instrument.contractType, isTpSlTriggered: false, userEmail: email ? email : null });
        const { side, trigger, orderValue } = createOrderDto, body = tslib_1.__rest(createOrderDto, ["side", "trigger", "orderValue"]);
        const tpSlOrder = {
            stopLossOrderId: null,
            takeProfitOrderId: null,
        };
        let stopLossOrder;
        let takeProfitOrder;
        if (body.stopLoss) {
            stopLossOrder = await this.orderRepoMaster.save(Object.assign(Object.assign({}, body), { accountId,
                userId, side: order.side === order_enum_1.OrderSide.BUY ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY, tpSLPrice: body.stopLoss, trigger: order.stopLossTrigger, orderValue: '0', tpSLType: order_enum_1.TpSlType.STOP_MARKET, stopLoss: null, takeProfit: null, price: null, type: order_enum_1.OrderType.MARKET, asset: order.asset, leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`, marginMode: marginMode ? marginMode.marginMode : defaultMarginMode, timeInForce: order_enum_1.OrderTimeInForce.IOC, isHidden: true, stopCondition: order.stopLossCondition, isReduceOnly: true, isTpSlOrder: true, contractType: instrument.contractType, isPostOnly: false, userEmail: email ? email : null, originalCost: '0', originalOrderMargin: '0' }));
            tpSlOrder.stopLossOrderId = stopLossOrder.id;
        }
        if (body.takeProfit) {
            takeProfitOrder = await this.orderRepoMaster.save(Object.assign(Object.assign({}, body), { accountId: accountId, userId, side: side === order_enum_1.OrderSide.BUY ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY, tpSLPrice: body.takeProfit, trigger: order.takeProfitTrigger, orderValue: '0', tpSLType: order_enum_1.TpSlType.TAKE_PROFIT_MARKET, stopLoss: null, takeProfit: null, price: null, type: order_enum_1.OrderType.MARKET, asset: order.asset, leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`, marginMode: marginMode ? marginMode.marginMode : defaultMarginMode, timeInForce: order_enum_1.OrderTimeInForce.IOC, isHidden: true, stopCondition: order.takeProfitCondition, isReduceOnly: true, isTpSlOder: true, contractType: instrument.contractType, isPostOnly: false, userEmail: email ? email : null, originalCost: '0', originalOrderMargin: '0' }));
            tpSlOrder.takeProfitOrderId = takeProfitOrder.id;
        }
        const newOrder = await this.orderRepoMaster.save(Object.assign(Object.assign(Object.assign({}, order), tpSlOrder), { originalCost: '0', originalOrderMargin: '0' }));
        this.removeEmptyValues(newOrder);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.PLACE_ORDER,
            data: class_transformer_1.plainToClass(order_entity_1.OrderEntity, newOrder),
        });
        if (body.stopLoss) {
            this.removeEmptyValues(stopLossOrder);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.PLACE_ORDER,
                data: class_transformer_1.plainToClass(order_entity_1.OrderEntity, Object.assign(Object.assign({}, stopLossOrder), { linkedOrderId: tpSlOrder.takeProfitOrderId ? tpSlOrder.takeProfitOrderId : null, parentOrderId: newOrder.id })),
            });
        }
        if (body.takeProfit) {
            this.removeEmptyValues(takeProfitOrder);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.PLACE_ORDER,
                data: class_transformer_1.plainToClass(order_entity_1.OrderEntity, Object.assign(Object.assign({}, takeProfitOrder), { linkedOrderId: tpSlOrder.stopLossOrderId ? tpSlOrder.stopLossOrderId : null, parentOrderId: newOrder.id })),
            });
        }
        return newOrder;
    }
    async getRootOrder(accountId, orderId, type) {
        const where = {
            accountId: accountId,
        };
        if (type == order_enum_1.ORDER_TPSL.STOP_LOSS) {
            where['stopLossOrderId'] = orderId;
        }
        if (type == order_enum_1.ORDER_TPSL.TAKE_PROFIT) {
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
    async findOrderBatch(status, fromId, count) {
        return await this.orderRepoMaster.findOrderBatch(status, fromId, count);
    }
    async findAccountOrderBatch(userId, status, fromId, count, types, cancelOrderType, contractType) {
        return await this.orderRepoReport.findAccountOrderBatch(userId, status, fromId, count, types, cancelOrderType, contractType);
    }
    async cancelOrder(orderId, userId) {
        const canceledOrder = await this.orderRepoReport.findOne({
            where: {
                id: orderId,
                userId: userId,
                status: typeorm_2.In([order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.PENDING, order_enum_1.OrderStatus.UNTRIGGERED]),
            },
        });
        if (!canceledOrder) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.CANCEL_ORDER,
            data: canceledOrder,
        });
        return canceledOrder;
    }
    async cancelAllOrder(userId, cancelOrderType, contractType) {
        const statuses = [order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.PENDING, order_enum_1.OrderStatus.UNTRIGGERED];
        let types = [];
        switch (cancelOrderType) {
            case order_enum_1.CANCEL_ORDER_TYPE.LIMIT:
                types = order_const_1.CANCEL_LIMIT_TYPES;
                break;
            case order_enum_1.CANCEL_ORDER_TYPE.STOP:
                types = order_const_1.CANCEL_STOP_TYPES;
                break;
            case order_enum_1.CANCEL_ORDER_TYPE.ALL:
                types = [...order_const_1.CANCEL_STOP_TYPES, order_enum_1.OrderType.LIMIT];
                break;
            default:
                break;
        }
        return await this.sendDataCancelToKafka(statuses, userId, types, cancelOrderType, contractType);
    }
    async sendDataCancelToKafka(statuses, userId, types, cancelOrderType, contractType) {
        const producer = kafka_1.kafka.producer();
        await producer.connect();
        for (const status of statuses) {
            await this.cancelOrderByStatus(userId, status, producer, types, cancelOrderType, contractType);
        }
        await producer.disconnect();
        return [];
    }
    async cancelOrderByStatus(userId, status, producer, types, cancelOrderType, contractType) {
        const loader = async (fromId, size) => {
            return await this.findAccountOrderBatch(userId, status, fromId, size, types, cancelOrderType, contractType);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.CANCEL_ORDER, kafka_enum_1.KafkaTopics.matching_engine_input);
    }
    async getLastOrderId() {
        return await this.orderRepoMaster.getLastId();
    }
    async getHistoryOrders(userId, paging, orderHistoryDto) {
        const startTime = moment(orderHistoryDto.startTime).format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment(orderHistoryDto.endTime).format('YYYY-MM-DD HH:mm:ss');
        const [{ orders, count }, { tradeBuy, tradeSell }] = await Promise.all([
            this.orderRepoReport.getOrderHistory(orderHistoryDto, startTime, endTime, userId, paging),
            this.tradeRepoReport.getDataTrade(userId, orderHistoryDto.symbol, orderHistoryDto.contractType),
        ]);
        for (const order of orders) {
            let trade;
            switch (order.side) {
                case order_enum_1.OrderSide.BUY:
                    trade = tradeBuy.find((trade) => trade.buyOrderId == order.id);
                    break;
                case order_enum_1.OrderSide.SELL:
                    trade = tradeSell.find((trade) => trade.sellOrderId == order.id);
                    break;
                default:
                    break;
            }
            if (trade) {
                order['average'] = trade.average;
            }
        }
        return {
            data: orders,
            metadata: {
                totalPage: Math.ceil(count / paging.size),
            },
        };
    }
    async validateOrder(createOrder) {
        var _a;
        const order = Object.assign({}, createOrder);
        order.remaining = order.quantity;
        order.status = order_enum_1.OrderStatus.PENDING;
        order.timeInForce = order.timeInForce || order_enum_1.OrderTimeInForce.GTC;
        const tradingRule = await this.instrumentService.getTradingRuleBySymbol(order.symbol);
        const { maxFiguresForPrice, maxFiguresForSize } = await this.instrumentService.findBySymbol(order.symbol);
        const num = parseInt('1' + '0'.repeat(+maxFiguresForSize));
        const minimumQty = new bignumber_js_1.default(`${(1 / num).toFixed(+maxFiguresForSize)}`);
        const maximumQty = new bignumber_js_1.default(tradingRule.maxOrderAmount);
        if (minimumQty.gt(order.quantity)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_MINIMUM_QUANTITY_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
        }
        if (maximumQty.lt(order.quantity)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_MAXIMUM_QUANTITY_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
        }
        if (this.validatePrecision(order.quantity, maxFiguresForSize)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_QUANTITY_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
        }
        if (order.price) {
            if (this.validatePrecision(order.price, maxFiguresForPrice)) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        await this.validateMinMaxPrice(createOrder);
        let checkPrice;
        if (order.type === order_enum_1.OrderType.MARKET && !order.tpSLType) {
            const tickers = await this.cacheService.get(ticker_const_1.TICKERS_KEY);
            const ticker = tickers.find((ticker) => ticker.symbol === order.symbol);
            checkPrice = (_a = ticker === null || ticker === void 0 ? void 0 : ticker.lastPrice) !== null && _a !== void 0 ? _a : null;
        }
        else if (order.type === order_enum_1.OrderType.MARKET && order.tpSLType === order_enum_1.TpSlType.STOP_MARKET) {
            checkPrice = order.tpSLPrice;
        }
        if (order.takeProfit || order.takeProfitTrigger) {
            if (order.takeProfit && order.takeProfitTrigger) {
                if (order.side == order_enum_1.OrderSide.BUY && Number(order.takeProfit) <= Number(checkPrice)) {
                    throw new common_1.HttpException(exceptions_1.httpErrors.TAKE_PROFIT_TRIGGER_OR_PRICE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
                }
                if (order.side == order_enum_1.OrderSide.SELL && Number(order.takeProfit) >= Number(checkPrice)) {
                    throw new common_1.HttpException(exceptions_1.httpErrors.TAKE_PROFIT_TRIGGER_OR_PRICE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_1.HttpException(exceptions_1.httpErrors.TAKE_PROFIT_TRIGGER_OR_PRICE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!order.takeProfitCondition) {
                throw new common_1.HttpException(exceptions_1.httpErrors.TAKE_PROFIT_CONDITION_UNDEFINED, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (order.stopLoss || order.stopLossTrigger) {
            if (order.stopLoss && order.stopLossTrigger) {
                if (order.side == order_enum_1.OrderSide.BUY && Number(order.stopLoss) >= Number(checkPrice)) {
                    throw new common_1.HttpException(exceptions_1.httpErrors.STOP_LOSS_TRIGGER_OR_PRICE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
                }
                if (order.side == order_enum_1.OrderSide.SELL && Number(order.stopLoss) <= Number(checkPrice)) {
                    throw new common_1.HttpException(exceptions_1.httpErrors.STOP_LOSS_TRIGGER_OR_PRICE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_1.HttpException(exceptions_1.httpErrors.STOP_LOSS_TRIGGER_OR_PRICE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!order.stopLossCondition) {
                throw new common_1.HttpException(exceptions_1.httpErrors.STOP_LOSS_CONDITION_UNDEFINED, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (order.tpSLType == order_enum_1.TpSlType.TRAILING_STOP) {
            order.type = order_enum_1.OrderType.MARKET;
            delete order.price;
            order.timeInForce = order_enum_1.OrderTimeInForce.IOC;
            delete order.isPostOnly;
            delete order.isHidden;
            delete order.takeProfit;
            delete order.takeProfitTrigger;
            delete order.stopLoss;
            delete order.stopLossTrigger;
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.activationPrice || new bignumber_js_1.default(order.activationPrice).lte(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_ACTIVATION_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.callbackRate) {
                throw new common_1.HttpException(exceptions_1.httpErrors.CALLBACK_RATE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
            if (this.validatePrecision(order.activationPrice, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRAIL_VALUE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (order.type !== order_enum_1.OrderType.MARKET) {
                throw new common_1.HttpException(exceptions_1.httpErrors.TRAILING_STOP_ORDER_TYPE_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
            return order;
        }
        if (order.type === order_enum_1.OrderType.LIMIT && order.isPostOnly) {
            order.timeInForce = order_enum_1.OrderTimeInForce.GTC;
            delete order.isHidden;
            if ((order.stopLoss || order.takeProfit) && !order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            return order;
        }
        if (order.type == order_enum_1.OrderType.LIMIT && order.tpSLType == order_enum_1.TpSlType.STOP_LIMIT) {
            if (!order.price)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.tpSLPrice || new bignumber_js_1.default(order.tpSLPrice).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.stopCondition) {
                throw new common_1.HttpException(exceptions_1.httpErrors.NOT_HAVE_STOP_CONDITION, common_1.HttpStatus.BAD_REQUEST);
            }
            if (this.validatePrecision(order.tpSLPrice, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.MARKET && order.tpSLType == order_enum_1.TpSlType.STOP_MARKET) {
            delete order.price;
            order.timeInForce = order_enum_1.OrderTimeInForce.IOC;
            delete order.isPostOnly;
            delete order.isHidden;
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.tpSLPrice || new bignumber_js_1.default(order.tpSLPrice).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (this.validatePrecision(order.tpSLPrice, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.stopCondition) {
                throw new common_1.HttpException(exceptions_1.httpErrors.NOT_HAVE_STOP_CONDITION, common_1.HttpStatus.BAD_REQUEST);
            }
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.LIMIT && order.takeProfit && new bignumber_js_1.default(order.takeProfit).gt(0)) {
            if (!order.price || new bignumber_js_1.default(order.price).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.takeProfit || new bignumber_js_1.default(order.takeProfit).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (this.validatePrecision(order.takeProfit, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.LIMIT && order.stopLoss && new bignumber_js_1.default(order.stopLoss).gt(0)) {
            if (!order.price || new bignumber_js_1.default(order.price).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.stopLoss || new bignumber_js_1.default(order.stopLoss).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (this.validatePrecision(order.stopLoss, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.MARKET && order.takeProfit && new bignumber_js_1.default(order.takeProfit).gt(0)) {
            delete order.price;
            order.timeInForce = order_enum_1.OrderTimeInForce.IOC;
            delete order.isPostOnly;
            delete order.isHidden;
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.takeProfit || new bignumber_js_1.default(order.takeProfit).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (this.validatePrecision(order.takeProfit, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.MARKET && order.stopLoss && new bignumber_js_1.default(order.stopLoss).gt(0)) {
            delete order.price;
            order.timeInForce = order_enum_1.OrderTimeInForce.IOC;
            delete order.isPostOnly;
            delete order.isHidden;
            if (!order.trigger)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_TRIGGER_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (!order.stopLoss || new bignumber_js_1.default(order.stopLoss).eq(0))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (this.validatePrecision(order.stopLoss, maxFiguresForPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_STOP_PRICE_PRECISION_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.LIMIT) {
            if (!order.price)
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            delete order.trigger;
            delete order.activationPrice;
            return order;
        }
        if (order.type == order_enum_1.OrderType.MARKET) {
            delete order.price;
            order.timeInForce = order_enum_1.OrderTimeInForce.IOC;
            delete order.isPostOnly;
            delete order.isHidden;
            delete order.trigger;
            delete order.activationPrice;
            return order;
        }
        this.logger.debug('ORDER_UNKNOWN_VALIDATION_FAIL');
        this.logger.debug(createOrder);
        this.logger.debug(order);
        throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
    }
    validatePrecision(value, precision) {
        const numberOfDecimalFigures = value.toString().split('.')[1];
        if (!numberOfDecimalFigures) {
            return false;
        }
        return numberOfDecimalFigures.length > +precision.toString();
    }
    async validateMinMaxPrice(createOrderDto) {
        const order = Object.assign({}, createOrderDto);
        const [tradingRules, instrument, markPrice] = await Promise.all([
            this.tradingRulesService.getTradingRuleByInstrumentId(order.symbol),
            this.instrumentRepoReport.findOne({ where: { symbol: order.symbol } }),
            this.redisService.getClient().get(`${index_const_1.ORACLE_PRICE_PREFIX}${order.symbol}`),
        ]);
        let price;
        let minPrice;
        let maxPrice;
        switch (order.side) {
            case order_enum_1.OrderSide.SELL: {
                maxPrice = new bignumber_js_1.default(instrument === null || instrument === void 0 ? void 0 : instrument.maxPrice);
                minPrice = new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.minPrice);
                if ((order.type == order_enum_1.OrderType.LIMIT && !order.tpSLType) || order.isPostOnly == true) {
                    price = new bignumber_js_1.default(markPrice).times(new bignumber_js_1.default(1).minus(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.floorRatio).dividedBy(100)));
                    minPrice = bignumber_js_1.default.maximum(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.minPrice), price);
                }
                if (order.tpSLType == order_enum_1.TpSlType.STOP_LIMIT) {
                    price = new bignumber_js_1.default(order.tpSLPrice).times(new bignumber_js_1.default(1).minus(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.floorRatio).dividedBy(100)));
                    minPrice = bignumber_js_1.default.maximum(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.minPrice), price);
                }
                if (new bignumber_js_1.default(order.price).isLessThan(minPrice))
                    throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
                if (new bignumber_js_1.default(order.price).isGreaterThan(instrument.maxPrice)) {
                    throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
                }
                break;
            }
            case order_enum_1.OrderSide.BUY: {
                maxPrice = new bignumber_js_1.default(instrument === null || instrument === void 0 ? void 0 : instrument.maxPrice);
                minPrice = new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.minPrice);
                if ((order.type == order_enum_1.OrderType.LIMIT && !order.tpSLType) || order.isPostOnly == true) {
                    price = new bignumber_js_1.default(markPrice).times(new bignumber_js_1.default(1).plus(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.limitOrderPrice).dividedBy(100)));
                    maxPrice = bignumber_js_1.default.minimum((new bignumber_js_1.default(instrument === null || instrument === void 0 ? void 0 : instrument.maxPrice), price));
                }
                if (order.tpSLType == order_enum_1.TpSlType.STOP_LIMIT) {
                    price = new bignumber_js_1.default(order.tpSLPrice).times(new bignumber_js_1.default(1).plus(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.limitOrderPrice).dividedBy(100)));
                    maxPrice = bignumber_js_1.default.minimum((new bignumber_js_1.default(instrument === null || instrument === void 0 ? void 0 : instrument.maxPrice), price));
                }
                if (new bignumber_js_1.default(order.price).isLessThan(minPrice))
                    throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
                if (new bignumber_js_1.default(order.price).isGreaterThan(maxPrice))
                    throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
                break;
            }
            default:
                break;
        }
    }
    async getTpSlOrder(rootOrderId) {
        const rootOrder = await this.orderRepoReport.findOne({
            where: {
                id: +rootOrderId,
            },
        });
        if (!rootOrder || (!rootOrder.takeProfitOrderId && !rootOrder.stopLossOrderId)) {
            return new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
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
    async updateTpSlOrder(userId, updateTpSlOrder, rootOrderId) {
        if (updateTpSlOrder.length === 0) {
            return;
        }
        const rootOrder = await this.orderRepoReport.findOne(rootOrderId);
        if (!rootOrder) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        const maxPrice = await this.cacheManager.get(`${trading_rules_constants_1.MAX_PRICE}_${rootOrder.symbol}`);
        let minPrice = await this.cacheManager.get(`${trading_rules_constants_1.MIN_PRICE}_${rootOrder.symbol}`);
        if (!maxPrice) {
            const instrument = await this.instrumentRepoReport.findOne({ symbol: rootOrder.symbol }), maxPrice = instrument.maxPrice;
            await this.cacheManager.set(`${trading_rules_constants_1.MAX_PRICE}_${rootOrder.symbol}`, maxPrice, { ttl: Number.MAX_SAFE_INTEGER });
        }
        if (!minPrice) {
            const tradingRule = await this.tradingRulesRepoReport.findOne({ symbol: rootOrder.symbol });
            minPrice = tradingRule.minPrice;
            await this.cacheManager.set(`${trading_rules_constants_1.MIN_PRICE}_${rootOrder.symbol}`, minPrice, { ttl: Number.MAX_SAFE_INTEGER });
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
            const { orderId } = element, dataUpdate = tslib_1.__rest(element, ["orderId"]);
            const isExistOrder = await this.orderRepoReport.findOne({ id: orderId, userId });
            if (!isExistOrder) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
            }
            if (+element.tpSLPrice < minPrice || +element.tpSLPrice > maxPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
            if (rootOrder.side == order_enum_1.OrderSide.BUY &&
                isExistOrder.tpSLType === order_enum_1.TpSlType.TAKE_PROFIT_MARKET &&
                +dataUpdate.tpSLPrice <= checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
            if (rootOrder.side == order_enum_1.OrderSide.BUY &&
                isExistOrder.tpSLType === order_enum_1.TpSlType.STOP_MARKET &&
                +dataUpdate.tpSLPrice >= checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
            if (rootOrder.side == order_enum_1.OrderSide.SELL &&
                isExistOrder.tpSLType === order_enum_1.TpSlType.TAKE_PROFIT_MARKET &&
                +dataUpdate.tpSLPrice >= checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
            if (rootOrder.side == order_enum_1.OrderSide.SELL &&
                isExistOrder.tpSLType === order_enum_1.TpSlType.STOP_MARKET &&
                +dataUpdate.tpSLPrice <= checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_UNKNOWN_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
            if (isExistOrder.tpSLType === order_enum_1.TpSlType.TAKE_PROFIT_MARKET) {
                tpSlOrder.tpOrderId = isExistOrder.id;
                tpSlOrder.tpOrderChangePrice = dataUpdate.tpSLPrice;
                tpSlOrder.tpOrderTrigger = dataUpdate.trigger === isExistOrder.trigger ? null : dataUpdate.trigger;
            }
            if (isExistOrder.tpSLType === order_enum_1.TpSlType.STOP_MARKET) {
                tpSlOrder.slOrderId = isExistOrder.id;
                tpSlOrder.slOrderChangePrice = dataUpdate.tpSLPrice;
                tpSlOrder.slOrderTrigger = dataUpdate.trigger === isExistOrder.trigger ? null : dataUpdate.trigger;
            }
        }
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.ADJUST_TP_SL_PRICE,
            data: Object.assign({}, tpSlOrder),
        });
    }
    removeEmptyValues(object) {
        for (const key in object) {
            if (key !== 'userEmail' && object.hasOwnProperty(key)) {
                const value = object[key];
                if (value === null || value === undefined || value === '') {
                    delete object[key];
                }
            }
        }
    }
    async calOrderMargin(accountId, asset) {
        try {
            const result = await this.orderRepoReport
                .createQueryBuilder('o')
                .where('o.asset = :asset', { asset })
                .andWhere('o.accountId = :accountId', { accountId })
                .andWhere('o.status IN (:status)', {
                status: [order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED],
            })
                .select('SUM(o.cost) as totalCost')
                .getRawOne();
            return result.totalCost ? result.totalCost : 0;
        }
        catch (error) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateUserIdInOrder() {
        let skip = transaction_const_1.START_CRAWL;
        const take = transaction_const_1.GET_NUMBER_RECORD;
        do {
            const orders = await this.orderRepoReport.find({
                where: {
                    userId: typeorm_2.IsNull(),
                },
                skip,
                take,
            });
            skip += take;
            if (orders.length) {
                for (const o of orders) {
                    const user = await typeorm_2.getConnection('report').getRepository(account_entity_1.AccountEntity).findOne({
                        id: o.accountId,
                    });
                    if (!user)
                        continue;
                    await this.orderRepoMaster.update({ accountId: user.id }, { userId: user.userId });
                    const newAccount = await this.accountRepoReport.findOne({
                        userId: user.userId,
                        asset: o.asset.toLowerCase(),
                    });
                    await this.orderRepoMaster.update({ userId: newAccount.userId }, { accountId: newAccount.id });
                }
            }
            else {
                break;
            }
        } while (true);
    }
    async updateUserEmailInOrder() {
        let skip = 0;
        const take = transaction_const_1.GET_NUMBER_RECORD;
        do {
            const ordersUpdate = await this.orderRepoReport.find({
                where: { userEmail: typeorm_2.IsNull() },
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
                    task.push(this.orderRepoMaster.update({ id: order.id }, {
                        userEmail: user.email ? user.email : null,
                        createdAt: () => `orders.createdAt`,
                        updatedAt: () => `orders.updatedAt`,
                    }));
                }
                await Promise.all([...task]);
            }
            else {
                break;
            }
        } while (true);
    }
};
OrderService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(1, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'report')),
    tslib_1.__param(2, typeorm_1.InjectRepository(trade_repository_1.TradeRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'master')),
    tslib_1.__param(4, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(user_margin_mode_repository_1.UserMarginModeRepository, 'report')),
    tslib_1.__param(11, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(12, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(13, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(16, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'report')),
    tslib_1.__param(17, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(18, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger,
        order_repository_1.OrderRepository,
        trade_repository_1.TradeRepository,
        order_repository_1.OrderRepository,
        position_repository_1.PositionRepository,
        instrument_repository_1.InstrumentRepository,
        user_margin_mode_repository_1.UserMarginModeRepository,
        kafka_client_1.KafkaClient,
        instrument_service_1.InstrumentService,
        account_service_1.AccountService,
        users_service_1.UserService, Object, account_repository_1.AccountRepository,
        account_repository_1.AccountRepository,
        nestjs_redis_1.RedisService,
        trading_rule_service_1.TradingRulesService,
        trading_rules_repository_1.TradingRulesRepository, Object, user_repository_1.UserRepository])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map