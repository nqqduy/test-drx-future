"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionService = void 0;
const tslib_1 = require("tslib");
const trade_const_1 = require("../trade/trade.const");
const pagination_util_1 = require("../../shares/pagination-util");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bignumber_js_1 = require("bignumber.js");
const position_history_entity_1 = require("../../models/entities/position-history.entity");
const position_entity_1 = require("../../models/entities/position.entity");
const position_history_repository_1 = require("../../models/repositories/position-history.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const response_dto_1 = require("../../shares/dtos/response.dto");
const exceptions_1 = require("../../shares/exceptions");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const typeorm_2 = require("typeorm");
const account_service_1 = require("../account/account.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const class_transformer_1 = require("class-transformer");
const position_enum_1 = require("../../shares/enums/position.enum");
const order_repository_1 = require("../../models/repositories/order.repository");
const order_enum_1 = require("../../shares/enums/order.enum");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const user_margin_mode_repository_1 = require("../../models/repositories/user-margin-mode.repository");
const base_engine_service_1 = require("../matching-engine/base-engine.service");
const order_entity_1 = require("../../models/entities/order.entity");
const moment = require("moment");
const index_const_1 = require("../index/index.const");
const instrument_service_1 = require("../instrument/instrument.service");
const account_repository_1 = require("../../models/repositories/account.repository");
const trading_rules_repository_1 = require("../../models/repositories/trading-rules.repository");
const trading_rules_constants_1 = require("../trading-rules/trading-rules.constants");
const nestjs_redis_1 = require("nestjs-redis");
const position_const_1 = require("./position.const");
const user_repository_1 = require("../../models/repositories/user.repository");
const market_data_repository_1 = require("../../models/repositories/market-data.repository");
const funding_history_repository_1 = require("../../models/repositories/funding-history.repository");
const margin_history_repository_1 = require("../../models/repositories/margin-history.repository");
const trading_rule_service_1 = require("../trading-rules/trading-rule.service");
const index_service_1 = require("../index/index.service");
const leverage_margin_repository_1 = require("../../models/repositories/leverage-margin.repository");
const leverage_margin_entity_1 = require("../../models/entities/leverage-margin.entity");
const instrument_entity_1 = require("../../models/entities/instrument.entity");
const transaction_const_1 = require("../transaction/transaction.const");
const account_entity_1 = require("../../models/entities/account.entity");
let PositionService = class PositionService extends base_engine_service_1.BaseEngineService {
    constructor(positionRepoReport, positionRepoMaster, positionHistoryRepository, fundingHistoryRepository, marginHistoryRepository, accountService, cacheManager, kafkaClient, orderRepoReport, orderRepoMaster, instrumentRepoReport, accountRepoReport, tradingRulesRepoReport, userMarginModeRepoReport, userRepoReport, leverageMarginRepoReport, instrumentService, redisService, tradingRulesService, indexService, marketDataRepositoryReport) {
        super();
        this.positionRepoReport = positionRepoReport;
        this.positionRepoMaster = positionRepoMaster;
        this.positionHistoryRepository = positionHistoryRepository;
        this.fundingHistoryRepository = fundingHistoryRepository;
        this.marginHistoryRepository = marginHistoryRepository;
        this.accountService = accountService;
        this.cacheManager = cacheManager;
        this.kafkaClient = kafkaClient;
        this.orderRepoReport = orderRepoReport;
        this.orderRepoMaster = orderRepoMaster;
        this.instrumentRepoReport = instrumentRepoReport;
        this.accountRepoReport = accountRepoReport;
        this.tradingRulesRepoReport = tradingRulesRepoReport;
        this.userMarginModeRepoReport = userMarginModeRepoReport;
        this.userRepoReport = userRepoReport;
        this.leverageMarginRepoReport = leverageMarginRepoReport;
        this.instrumentService = instrumentService;
        this.redisService = redisService;
        this.tradingRulesService = tradingRulesService;
        this.indexService = indexService;
        this.marketDataRepositoryReport = marketDataRepositoryReport;
    }
    async getAllPositionByUserId(userId, paging, contractType, symbol) {
        const { offset, limit } = pagination_util_1.getQueryLimit(paging, trade_const_1.MAX_RESULT_COUNT);
        const getPositionByTakeProfit = `
        SELECT pTp.*
      FROM positions as pTp
      LEFT JOIN orders as oTp on pTp.takeProfitOrderId = oTp.id
      WHERE pTp.userId = ${userId} and pTp.currentQty <> '0'  ${contractType == order_enum_1.ContractType.ALL ? `` : `and pTp.contractType = '${contractType}'`}
      ${symbol ? `and pTp.symbol = '${symbol}'` : ``}
      ORDER BY pTp.updatedAt DESC
    `;
        const getPositionByStopLoss = `
SELECT pSl.*
        FROM positions as pSl
        LEFT JOIN orders as oSl on pSl.stopLossOrderId = oSl.id
        WHERE pSl.userId = ${userId} and pSl.currentQty <> '0' ${contractType == order_enum_1.ContractType.ALL ? `` : `and pSl.contractType = '${contractType}'`}
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
    WHERE countTP.userId = ${userId} and countTP.currentQty <> '0' ${contractType == order_enum_1.ContractType.ALL ? `` : `and countTP.contractType = '${contractType}'`}
    ${symbol ? `and countTP.symbol = '${symbol}'` : ``}`;
        const countQueryStopLoss = `
    SELECT countSL.*
    FROM positions as countSL
    LEFT JOIN orders on  countSL.stopLossOrderId = orders.id
    WHERE countSL.userId = ${userId} and countSL.currentQty <> '0' ${contractType == order_enum_1.ContractType.ALL ? `` : `and countSL.contractType = '${contractType}'`}
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
    async getAllPositionWithQuantity(userId, contractType, symbol) {
        const getPositionByTakeProfit = `
        SELECT pTp.*
      FROM positions as pTp
      LEFT JOIN orders as oTp on pTp.takeProfitOrderId = oTp.id
      WHERE pTp.userId = ${userId} ${contractType == order_enum_1.ContractType.ALL ? `` : `and pTp.contractType = '${contractType}'`}
      ${symbol ? `and pTp.symbol = '${symbol}'` : ``}
      ORDER BY pTp.updatedAt DESC
    `;
        const getPositionByStopLoss = `
SELECT pSl.*
        FROM positions as pSl
        LEFT JOIN orders as oSl on pSl.stopLossOrderId = oSl.id
        WHERE pSl.userId = ${userId} ${contractType == order_enum_1.ContractType.ALL ? `` : `and pSl.contractType = '${contractType}'`}
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
    async getAllPositionByAdmin(paging, queries) {
        const startTime = moment(queries.from).format('YYYY-MM-DD 00:00:00');
        const endTime = moment(queries.to).format('YYYY-MM-DD 23:59:59');
        const commonAndConditions = {
            currentQty: typeorm_2.Not(0),
        };
        if (queries.symbol) {
            commonAndConditions['symbol'] = typeorm_2.Like(`%${queries.symbol}%`);
        }
        if (queries.contractType && queries.contractType !== order_enum_1.ContractType.ALL) {
            commonAndConditions['contractType'] = typeorm_2.Like(`%${queries.contractType}%`);
        }
        const { offset, limit } = pagination_util_1.getQueryLimit(paging, trade_const_1.MAX_RESULT_COUNT);
        const query = this.positionRepoReport
            .createQueryBuilder('p')
            .select('p.*, u.email')
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
    async getPositionById(positionId) {
        const position = await this.positionRepoReport.findOne({ id: positionId });
        if (!position) {
            throw new common_1.HttpException('Position not found', common_1.HttpStatus.NOT_FOUND);
        }
        return position;
    }
    async findBatch(fromId, count) {
        return await this.positionRepoMaster.findBatch(fromId, count);
    }
    async findHistoryBefore(date) {
        return await this.positionHistoryRepository.findHistoryBefore(date);
    }
    async findHistoryBatch(fromId, count) {
        return await this.positionHistoryRepository.findBatch(fromId, count);
    }
    async getLastPositionId() {
        return await this.positionRepoMaster.getLastId();
    }
    async getPositionByUserIdBySymbol(userId, symbol) {
        const position = await this.positionRepoReport.find({
            where: {
                userId,
                symbol: symbol,
            },
        });
        if (position[0])
            return position[0];
        throw new common_1.HttpException(exceptions_1.httpErrors.POSITION_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
    async updateMargin(userId, updateMarginDto) {
        const position = await this.positionRepoReport.findOne({
            where: {
                userId,
                id: updateMarginDto.positionId,
                isCross: false,
                currentQty: typeorm_2.Not('0'),
            },
        });
        if (!position) {
            throw new common_1.HttpException(exceptions_1.httpErrors.POSITION_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        const account = await this.accountRepoReport.findOne({
            userId,
            asset: position.asset,
        });
        const usdtAvailableBalance = new bignumber_js_1.default(account.balance);
        if (usdtAvailableBalance.lt(+updateMarginDto.assignedMarginValue)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.NOT_ENOUGH_BALANCE, common_1.HttpStatus.BAD_REQUEST);
        }
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.ADJUST_MARGIN_POSITION,
            data: {
                userId,
                accountId: account.id,
                symbol: position.symbol,
                assignedMarginValue: updateMarginDto.assignedMarginValue,
            },
        });
        return true;
    }
    async closePosition(userId, body) {
        const { positionId, quantity, type, limitPrice } = body;
        const defaultMarginMode = order_enum_1.MarginMode.CROSS;
        const defaultLeverage = '20';
        const position = await this.positionRepoReport.findOne({
            where: {
                id: positionId,
                currentQty: typeorm_2.Not('0'),
            },
        });
        if (!position) {
            throw new common_1.HttpException(Object.assign(Object.assign({}, exceptions_1.httpErrors.POSITION_NOT_FOUND), { symbol: position.symbol }), common_1.HttpStatus.NOT_FOUND);
        }
        if (quantity > Math.abs(+position.currentQty)) {
            throw new common_1.HttpException(Object.assign(Object.assign({}, exceptions_1.httpErrors.POSITION_QUANTITY_NOT_ENOUGH), { symbol: position.symbol }), common_1.HttpStatus.BAD_REQUEST);
        }
        if (type === position_enum_1.ClosePositionType.LIMIT) {
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
        let closeOrder;
        switch (type) {
            case position_enum_1.ClosePositionType.MARKET:
                closeOrder = await this.orderRepoMaster.save({
                    userId: position.userId,
                    accountId: account.id,
                    side: +position.currentQty > 0 ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY,
                    quantity: `${quantity}`,
                    type: order_enum_1.OrderType.MARKET,
                    symbol: position.symbol,
                    timeInForce: order_enum_1.OrderTimeInForce.IOC,
                    status: order_enum_1.OrderStatus.PENDING,
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
            case position_enum_1.ClosePositionType.LIMIT:
                closeOrder = await this.orderRepoMaster.save({
                    userId: position.userId,
                    accountId: account.id,
                    side: +position.currentQty > 0 ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY,
                    quantity: `${quantity}`,
                    price: limitPrice,
                    type: order_enum_1.OrderType.LIMIT,
                    symbol: position.symbol,
                    timeInForce: order_enum_1.OrderTimeInForce.GTC,
                    status: order_enum_1.OrderStatus.PENDING,
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
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.PLACE_ORDER,
            data: class_transformer_1.plainToClass(order_entity_1.OrderEntity, closeOrder),
        });
        return closeOrder;
    }
    async closeAllPosition(userId, contractType) {
        const defaultMarginMode = order_enum_1.MarginMode.CROSS;
        const defaultLeverage = '20';
        const [positions, orders] = await Promise.all([
            this.positionRepoReport.find({
                where: {
                    userId,
                    currentQty: typeorm_2.Not('0'),
                    contractType: contractType,
                },
            }),
            this.orderRepoReport.find({
                userId,
                contractType: contractType,
                status: typeorm_2.In([order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED, order_enum_1.OrderStatus.PENDING]),
            }),
        ]);
        if (positions.length === 0) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCOUNT_HAS_NO_POSITION, common_1.HttpStatus.NOT_FOUND);
        }
        if (orders.length > 0) {
            await Promise.all(orders.map((order) => {
                this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                    code: matching_engine_const_1.CommandCode.CANCEL_ORDER,
                    data: order,
                });
            }));
        }
        await Promise.all(positions.map(async (position) => {
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
                side: +position.currentQty > 0 ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY,
                quantity: `${Math.abs(+position.currentQty)}`,
                type: order_enum_1.OrderType.MARKET,
                symbol: position.symbol,
                timeInForce: order_enum_1.OrderTimeInForce.IOC,
                status: order_enum_1.OrderStatus.PENDING,
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
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.PLACE_ORDER,
                data: class_transformer_1.plainToClass(order_entity_1.OrderEntity, cancelOrder),
            });
        }));
        return true;
    }
    async validateUpdatePosition(updatePositionDto, position) {
        const { takeProfit, stopLoss } = updatePositionDto;
        const checkPrice = position.entryPrice;
        let maxPrice = await this.cacheManager.get(`${trading_rules_constants_1.MAX_PRICE}_${position.symbol}`);
        let minPrice = await this.cacheManager.get(`${trading_rules_constants_1.MIN_PRICE}_${position.symbol}`);
        if (!maxPrice) {
            const instrument = await this.instrumentRepoReport.findOne({ symbol: position.symbol });
            maxPrice = instrument.maxPrice;
            await this.cacheManager.set(`${trading_rules_constants_1.MAX_PRICE}_${position.symbol}`, maxPrice, { ttl: Number.MAX_SAFE_INTEGER });
        }
        if (!minPrice) {
            const tradingRule = await this.tradingRulesRepoReport.findOne({ symbol: position.symbol });
            minPrice = tradingRule.minPrice;
            await this.cacheManager.set(`${trading_rules_constants_1.MIN_PRICE}_${position.symbol}`, minPrice, { ttl: Number.MAX_SAFE_INTEGER });
        }
        if (takeProfit && (+takeProfit < minPrice || +takeProfit > maxPrice)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        }
        if (stopLoss && (+stopLoss < minPrice || +stopLoss > maxPrice)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        }
        if (+position.currentQty > 0) {
            if (takeProfit && +takeProfit <= +checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
            if (stopLoss && +stopLoss >= +checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            if (takeProfit && +takeProfit >= +checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
            if (stopLoss && +stopLoss <= +checkPrice) {
                throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    async updatePosition(userId, updatePositionDto) {
        const { positionId, takeProfit, stopLoss, takeProfitTrigger, stopLossTrigger } = updatePositionDto;
        const whereCondition = {
            id: positionId,
            userId,
            currentQty: typeorm_2.Not('0'),
        };
        const position = await this.positionRepoReport.findOne({
            where: Object.assign({}, whereCondition),
        });
        if (!position) {
            throw new common_1.HttpException(exceptions_1.httpErrors.POSITION_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
        }
        if ((!takeProfit && !stopLoss) ||
            (!takeProfitTrigger && !stopLossTrigger) ||
            (!takeProfit && takeProfitTrigger) ||
            (takeProfit && !takeProfitTrigger) ||
            (!stopLoss && stopLossTrigger) ||
            (stopLoss && !stopLossTrigger)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_UPDATE_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        }
        await this.validateUpdatePosition(updatePositionDto, position);
        let stopLossOrder;
        let takeProfitOrder;
        const tpSlOrder = {
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
                type: order_enum_1.OrderType.MARKET,
                quantity: `${Math.abs(+position.currentQty)}`,
                remaining: `${Math.abs(+position.currentQty)}`,
                isReduceOnly: true,
                tpSLType: order_enum_1.TpSlType.STOP_MARKET,
                tpSLPrice: stopLoss,
                status: order_enum_1.OrderStatus.PENDING,
                timeInForce: order_enum_1.OrderTimeInForce.IOC,
                userId: userId,
                accountId: account.id,
                side: +position.currentQty > 0 ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY,
                asset: position.asset.toUpperCase(),
                leverage: position.leverage,
                marginMode: position.isCross ? order_enum_1.MarginMode.CROSS : order_enum_1.MarginMode.ISOLATE,
                price: null,
                trigger: stopLossTrigger,
                orderValue: '0',
                stopLoss: null,
                takeProfit: null,
                stopCondition: +position.currentQty > 0 ? order_enum_1.OrderStopCondition.LT : order_enum_1.OrderStopCondition.GT,
                isClosePositionOrder: true,
                isTpSlOrder: true,
                contractType: position.contractType,
                userEmail: account.userEmail,
                originalCost: '0',
                originalOrderMargin: '0',
            });
            tpSlOrder.stopLossOrderId = stopLossOrder.id;
            objectSend['slOrder'] = Object.assign(Object.assign({}, stopLossOrder), { createdAt: new Date(stopLossOrder.createdAt).getTime(), updatedAt: new Date(stopLossOrder.updatedAt).getTime(), action: matching_engine_const_1.ActionAdjustTpSl.PLACE });
        }
        if (takeProfit && position.takeProfitOrderId === null) {
            takeProfitOrder = await this.orderRepoMaster.save({
                symbol: position.symbol,
                type: order_enum_1.OrderType.MARKET,
                quantity: `${Math.abs(+position.currentQty)}`,
                remaining: `${Math.abs(+position.currentQty)}`,
                isReduceOnly: true,
                tpSLType: order_enum_1.TpSlType.TAKE_PROFIT_MARKET,
                tpSLPrice: takeProfit,
                status: order_enum_1.OrderStatus.PENDING,
                timeInForce: order_enum_1.OrderTimeInForce.IOC,
                userId: userId,
                accountId: account.id,
                side: +position.currentQty > 0 ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY,
                asset: position.asset.toUpperCase(),
                leverage: position.leverage,
                marginMode: position.isCross ? order_enum_1.MarginMode.CROSS : order_enum_1.MarginMode.ISOLATE,
                price: null,
                trigger: takeProfitTrigger,
                orderValue: '0',
                stopLoss: null,
                takeProfit: null,
                stopCondition: +position.currentQty > 0 ? order_enum_1.OrderStopCondition.GT : order_enum_1.OrderStopCondition.LT,
                isClosePositionOrder: true,
                contractType: position.contractType,
                userEmail: account.userEmail,
                originalCost: '0',
                originalOrderMargin: '0',
            });
            tpSlOrder.takeProfitOrderId = takeProfitOrder.id;
            objectSend['tpOrder'] = Object.assign(Object.assign({}, takeProfitOrder), { createdAt: new Date(takeProfitOrder.createdAt).getTime(), updatedAt: new Date(takeProfitOrder.updatedAt).getTime(), action: matching_engine_const_1.ActionAdjustTpSl.PLACE });
        }
        if (stopLossOrder) {
            objectSend['slOrder'].linkedOrderId = tpSlOrder.takeProfitOrderId ? tpSlOrder.takeProfitOrderId : null;
        }
        if (takeProfitOrder) {
            objectSend['tpOrder'].linkedOrderId = tpSlOrder.stopLossOrderId ? tpSlOrder.stopLossOrderId : null;
        }
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.ADJUST_TP_SL,
            data: Object.assign(Object.assign({}, objectSend), { userId, symbol: position.symbol, accountId: account.id }),
        });
    }
    async removeTpSlPosition(userId, removeTpSlDto) {
        const { positionId, takeProfitOrderId, stopLossOrderId } = removeTpSlDto;
        if ((!takeProfitOrderId && !stopLossOrderId) || (takeProfitOrderId && stopLossOrderId)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.PARAMS_REMOVE_TP_SL_POSITION_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        }
        const position = await this.positionRepoReport.findOne({
            where: {
                id: +positionId,
                userId,
                currentQty: typeorm_2.Not('0'),
            },
        });
        if (!position) {
            throw new common_1.HttpException(exceptions_1.httpErrors.POSITION_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        let order;
        const objectSend = {};
        if (takeProfitOrderId) {
            order = await this.orderRepoReport.findOne(+takeProfitOrderId);
            objectSend['tpOrder'] = Object.assign(Object.assign({}, order), { createdAt: new Date(order.createdAt).getTime(), updatedAt: new Date(order.updatedAt).getTime(), action: matching_engine_const_1.ActionAdjustTpSl.CANCEL });
        }
        else {
            order = await this.orderRepoReport.findOne(+stopLossOrderId);
            objectSend['slOrder'] = Object.assign(Object.assign({}, order), { createdAt: new Date(order.createdAt).getTime(), updatedAt: new Date(order.updatedAt).getTime(), action: matching_engine_const_1.ActionAdjustTpSl.CANCEL });
        }
        if (!order) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.ADJUST_TP_SL,
            data: Object.assign(Object.assign({}, objectSend), { userId, symbol: position.symbol, accountId: position.accountId }),
        });
    }
    async getTpSlOrderPosition(userId, positionId) {
        const position = await this.positionRepoReport.findOne(positionId);
        if (!position) {
            throw new common_1.HttpException(exceptions_1.httpErrors.POSITION_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
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
    async calPositionMarginForAcc(accountId, asset) {
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
            positionMargin: new bignumber_js_1.default(positionMarginIsIsolate).plus(positionMarginCross).toString(),
            unrealizedPNL,
            positionMarginCross,
            positionMarginIsIsolate,
        };
    }
    async calPositionMarginIsIsolate(symbols, accountId, asset) {
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
    async CalPositionMarginIsCross(accountId, asset) {
        const listPositions = await this.positionRepoReport
            .createQueryBuilder('p')
            .select(['p.currentQty as currentQty', 'p.leverage as leverage', 'p.entryPrice as entryPrice, p.symbol'])
            .where({
            isCross: true,
            accountId,
            asset,
        })
            .getRawMany();
        const markPrices = await Promise.all(listPositions.map((item) => this.cacheManager.get(`${index_const_1.INDEX_PRICE_PREFIX}${item.symbol}`)));
        let margin = '0';
        let pnl = '0';
        if (!listPositions.length) {
            return { margin, pnl };
        }
        for (let i = 0; i < listPositions.length; i++) {
            const item = listPositions[i];
            const markPrice = markPrices[i];
            const margin1 = new bignumber_js_1.default(item.currentQty).abs().times(markPrice).div(item.leverage).toString();
            const curPnl = new bignumber_js_1.default(item.currentQty).abs().times(new bignumber_js_1.default(markPrice).minus(item.entryPrice));
            let pnl1 = curPnl.toString();
            if (new bignumber_js_1.default(item.currentQty).lt(0)) {
                pnl1 = curPnl.negated().toString();
            }
            margin = new bignumber_js_1.default(margin).plus(margin1).toString();
            pnl = new bignumber_js_1.default(pnl).plus(pnl1).toString();
        }
        return { margin, pnl };
    }
    async updatePositions() {
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
                }
                else {
                    item.accountId = null;
                }
                await this.positionRepoMaster.save(item);
            }
        }
    }
    async calculateIndexPriceAverage(symbol) {
        const instrument = await this.instrumentService.findBySymbol(symbol);
        const newSymbol = symbol.replace('USDM', 'USDT');
        const now = new Date().getTime();
        const previousTime = now - position_const_1.PREVIOUS_TIME;
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
    async validateMinMaxPrice(position, limitPrice) {
        const [tradingRules, instrument, markPrice] = await Promise.all([
            this.tradingRulesService.getTradingRuleByInstrumentId(position.symbol),
            this.instrumentRepoReport.findOne({ where: { symbol: position.symbol } }),
            this.redisService.getClient().get(`${index_const_1.ORACLE_PRICE_PREFIX}${position.symbol}`),
        ]);
        let price;
        let minPrice = new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.minPrice);
        let maxPrice = new bignumber_js_1.default(instrument === null || instrument === void 0 ? void 0 : instrument.maxPrice);
        if (+position.currentQty > 0) {
            price = new bignumber_js_1.default(markPrice).times(new bignumber_js_1.default(1).minus(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.floorRatio).dividedBy(100)));
            minPrice = bignumber_js_1.default.maximum(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.minPrice), price);
            if (new bignumber_js_1.default(limitPrice).isLessThan(minPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (new bignumber_js_1.default(limitPrice).isGreaterThan(instrument.maxPrice)) {
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            price = new bignumber_js_1.default(markPrice).times(new bignumber_js_1.default(1).plus(new bignumber_js_1.default(tradingRules === null || tradingRules === void 0 ? void 0 : tradingRules.limitOrderPrice).dividedBy(100)));
            maxPrice = bignumber_js_1.default.minimum((new bignumber_js_1.default(instrument === null || instrument === void 0 ? void 0 : instrument.maxPrice), price));
            if (new bignumber_js_1.default(limitPrice).isLessThan(minPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
            if (new bignumber_js_1.default(limitPrice).isGreaterThan(maxPrice))
                throw new common_1.HttpException(exceptions_1.httpErrors.ORDER_PRICE_VALIDATION_FAIL, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async closeAllPositionCommand(symbol) {
        const defaultMarginMode = order_enum_1.MarginMode.CROSS;
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
                where: Object.assign({ currentQty: typeorm_2.Not('0') }, wherePosition),
            }),
            this.orderRepoReport.find(Object.assign({ status: typeorm_2.In([order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED, order_enum_1.OrderStatus.PENDING]) }, whereOrder)),
        ]);
        if (orders.length > 0) {
            await Promise.all(orders.map((order) => {
                this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                    code: matching_engine_const_1.CommandCode.CANCEL_ORDER,
                    data: order,
                });
            }));
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
            await Promise.all(chunk.map(async (position) => {
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
                    side: +position.currentQty > 0 ? order_enum_1.OrderSide.SELL : order_enum_1.OrderSide.BUY,
                    quantity: `${Math.abs(+position.currentQty)}`,
                    type: order_enum_1.OrderType.LIMIT,
                    symbol: position.symbol,
                    timeInForce: order_enum_1.OrderTimeInForce.GTC,
                    status: order_enum_1.OrderStatus.PENDING,
                    asset: position.asset,
                    marginMode: marginMode ? marginMode.marginMode : defaultMarginMode,
                    leverage: marginMode ? marginMode.leverage : `${defaultLeverage}`,
                    remaining: `${Math.abs(+position.currentQty)}`,
                    isClosePositionOrder: true,
                    contractType: instrument.contractType,
                    userEmail: account.userEmail,
                    price: averageIndexPrice,
                });
                await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                    code: matching_engine_const_1.CommandCode.PLACE_ORDER,
                    data: class_transformer_1.plainToClass(order_entity_1.OrderEntity, cancelOrder),
                });
            }));
            offset += chunk.length;
        }
    }
    async updateIdPositionCommand() {
        const startPositionId = order_entity_1.MIN_ORDER_ID;
        const positions = await this.positionRepoReport.find();
        let offset = 0;
        for (const position of positions) {
            const newPositionId = +startPositionId + +offset;
            await this.positionRepoMaster.update({ id: position.id }, { id: newPositionId, updatedAt: position.updatedAt });
            await this.positionHistoryRepository.update({ positionId: `${position.id}` }, { positionId: `${newPositionId}`, updatedAt: () => 'position_histories.updatedAt' });
            await this.marginHistoryRepository.update({ positionId: `${position.id}` }, { positionId: `${newPositionId}`, updatedAt: () => 'margin_histories.updatedAt' });
            await this.fundingHistoryRepository.update({ positionId: `${position.id}` }, { positionId: `${newPositionId}`, updatedAt: () => 'funding_histories.updatedAt' });
            offset++;
        }
    }
    async getInforPositions(userId, symbol) {
        const listSymbol = [...transaction_const_1.LIST_SYMBOL_COINM, ...transaction_const_1.LIST_SYMBOL_USDM];
        const response = [];
        if (symbol) {
            if (!listSymbol.includes(symbol)) {
                throw new common_1.HttpException(exceptions_1.httpErrors.SYMBOL_DOES_NOT_EXIST, common_1.HttpStatus.NOT_FOUND);
            }
            const result = await this.getInforAPosition(symbol, userId);
            if (Object.keys(result).length === 0) {
                return response;
            }
            response.push(result);
        }
        else {
            for (const symbol of listSymbol) {
                const result = await this.getInforAPosition(symbol, userId);
                if (Object.keys(result).length !== 0) {
                    response.push(result);
                }
            }
        }
        return response;
    }
    getLeverageMargin(leverageMargin, checkValue) {
        let selected = null;
        for (const item of leverageMargin) {
            const bigNumberCheckValue = new bignumber_js_1.default(checkValue);
            if (new bignumber_js_1.default(item.min).isLessThanOrEqualTo(checkValue) &&
                bigNumberCheckValue.isLessThanOrEqualTo(new bignumber_js_1.default(item.max))) {
                selected = item;
            }
        }
        if (selected === null) {
            selected = leverageMargin[leverageMargin.length - 1];
        }
        return selected;
    }
    calMaintenanceMargin(leverageMargin, checkTier, position, oraclePrice, contractType, instrument) {
        if (contractType === order_enum_1.ContractType.USD_M) {
            const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);
            const maintenanceMargin = new bignumber_js_1.default(position.currentQty)
                .abs()
                .times(new bignumber_js_1.default(oraclePrice))
                .times(new bignumber_js_1.default(selectedLeverageMargin.maintenanceMarginRate / 100))
                .minus(selectedLeverageMargin.maintenanceAmount)
                .toString();
            return maintenanceMargin;
        }
        else {
            const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);
            const maintenanceMargin = new bignumber_js_1.default(position.currentQty)
                .abs()
                .times(new bignumber_js_1.default(instrument.multiplier).div(new bignumber_js_1.default(oraclePrice)))
                .times(selectedLeverageMargin.maintenanceMarginRate / 100)
                .minus(selectedLeverageMargin.maintenanceAmount)
                .toString();
            return maintenanceMargin;
        }
    }
    async calMarginBalanceForCrossUSDM(userId, asset, oraclePrice, account) {
        const positions = await this.positionRepoReport.find({ where: { userId, asset, currentQty: typeorm_2.Not('0') } });
        let totalAllocatedMargin = '0';
        let totalUnrealizedPnl = '0';
        for (const position of positions) {
            const sideValue = +position.currentQty > 0 ? 1 : -1;
            const itemOraclePrice = await this.indexService.getOraclePrices([position.symbol]);
            if (position.isCross) {
                const unrealizedPNL = new bignumber_js_1.default(Math.abs(+position.currentQty) * (+itemOraclePrice[0] - +position.entryPrice) * sideValue).toString();
                totalUnrealizedPnl = new bignumber_js_1.default(totalUnrealizedPnl).plus(new bignumber_js_1.default(unrealizedPNL)).toString();
            }
            else {
                const allocatedMargin = +position.positionMargin + +position.adjustMargin;
                totalAllocatedMargin = new bignumber_js_1.default(totalAllocatedMargin).plus(new bignumber_js_1.default(allocatedMargin)).toString();
            }
        }
        const marginBalance = new bignumber_js_1.default(account.balance)
            .plus(new bignumber_js_1.default(totalUnrealizedPnl))
            .minus(new bignumber_js_1.default(totalAllocatedMargin));
        return marginBalance.toString();
    }
    async calMarginBalanceForCrossCOINM(userId, asset, oraclePrice, instrument, account) {
        const positions = await this.positionRepoReport.find({ where: { userId, asset, currentQty: typeorm_2.Not('0') } });
        let totalAllocatedMargin = '0';
        let totalUnrealizedPnl = '0';
        for (const position of positions) {
            const sideValue = +position.currentQty > 0 ? 1 : -1;
            if (position.isCross) {
                const unrealizedPNL = new bignumber_js_1.default(Math.abs(+position.currentQty) *
                    +instrument.multiplier *
                    (1 / +position.entryPrice - 1 / +oraclePrice) *
                    sideValue).toString();
                totalUnrealizedPnl = new bignumber_js_1.default(totalUnrealizedPnl).plus(new bignumber_js_1.default(unrealizedPNL)).toString();
            }
            else {
                const allocatedMargin = +position.positionMargin + +position.adjustMargin;
                totalAllocatedMargin = new bignumber_js_1.default(totalAllocatedMargin).plus(new bignumber_js_1.default(allocatedMargin)).toString();
            }
        }
        const marginBalance = new bignumber_js_1.default(account.balance)
            .plus(new bignumber_js_1.default(totalUnrealizedPnl))
            .minus(new bignumber_js_1.default(totalAllocatedMargin));
        return marginBalance.toString();
    }
    calMarginBalanceForIso(allocatedMargin, unrealizedPNL) {
        return new bignumber_js_1.default(allocatedMargin).plus(new bignumber_js_1.default(unrealizedPNL)).toString();
    }
    async getInforAPosition(symbol, userId) {
        const result = {};
        if (symbol) {
            const [position, oraclePrice, indexPrice, instrument, leverageMargin] = await Promise.all([
                this.positionRepoReport.findOne({ where: { symbol, userId, currentQty: typeorm_2.Not('0') } }),
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
                result[`${symbol}`] = Object.assign({}, position);
                result[`${symbol}`][`averageOpeningPrice`] = position.entryPrice;
                result[`${symbol}`][`marginType`] = position.isCross ? 'CROSS' : 'ISOLATED';
                result[`${symbol}`][`indexPrice`] = indexPrice[0];
                result[`${symbol}`][`markPrice`] = oraclePrice[0];
                result[`${symbol}`]['liquidationPrice'] = position.liquidationPrice;
                result[`${symbol}`]['totalPosition'] = position.currentQty;
                result[`${symbol}`]['averageClosingPrice'] = position.avgClosePrice;
                result[`${symbol}`]['closingPosition'] = position.closeSize;
                const checkTier = position.contractType === order_enum_1.ContractType.COIN_M
                    ? oraclePrice[0]
                        ? new bignumber_js_1.default(position.currentQty).abs().times(instrument.multiplier).div(oraclePrice[0]).toString()
                        : '0'
                    : new bignumber_js_1.default(position.currentQty).abs().times(oraclePrice[0]).toString();
                let allocatedMargin = '0';
                const sideValue = +position.currentQty > 0 ? 1 : -1;
                const account = await this.accountRepoReport.findOne({ where: { asset: position.asset, userId } });
                switch (position.contractType) {
                    case order_enum_1.ContractType.COIN_M:
                        if (position.isCross) {
                            const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);
                            const numerator = new bignumber_js_1.default(new bignumber_js_1.default(position.currentQty).abs().times(selectedLeverageMargin.maintenanceMarginRate / 100))
                                .plus(new bignumber_js_1.default(new bignumber_js_1.default(sideValue)).times(new bignumber_js_1.default(position.currentQty).abs()))
                                .toString();
                            const denominator = new bignumber_js_1.default(new bignumber_js_1.default(+account.balance + +selectedLeverageMargin.maintenanceAmount).div(new bignumber_js_1.default(instrument.multiplier)))
                                .plus(new bignumber_js_1.default((sideValue * Math.abs(+position.currentQty)) / +position.entryPrice))
                                .toString();
                            result[`${symbol}`]['liquidationPrice'] = new bignumber_js_1.default(numerator)
                                .div(new bignumber_js_1.default(denominator))
                                .toString();
                            console.log('check liquidtion coin m: ', {
                                position,
                                numerator,
                                denominator,
                                selectedLeverageMargin,
                                instrument,
                            });
                            const allocatedMargin = new bignumber_js_1.default(position.currentQty)
                                .abs()
                                .times(instrument.multiplier)
                                .div(new bignumber_js_1.default(position.leverage).times(new bignumber_js_1.default(oraclePrice[0])))
                                .toString();
                            result[`${symbol}`]['positionMargin'] = new bignumber_js_1.default(allocatedMargin).toString();
                        }
                        else {
                            allocatedMargin = new bignumber_js_1.default(position.positionMargin)
                                .plus(new bignumber_js_1.default(position.adjustMargin))
                                .toString();
                            result[`${symbol}`]['positionMargin'] = new bignumber_js_1.default(allocatedMargin).toString();
                        }
                        result[`${symbol}`]['unrealizedPNL'] = new bignumber_js_1.default(Math.abs(+position.currentQty) *
                            +instrument.multiplier *
                            (1 / +position.entryPrice - 1 / +oraclePrice[0]) *
                            sideValue).toString();
                        const maintenanceMarginCOINM = this.calMaintenanceMargin(leverageMargin, checkTier, position, oraclePrice[0], order_enum_1.ContractType.COIN_M, instrument);
                        const marginBalanceCOINM = position.isCross
                            ? await this.calMarginBalanceForCrossCOINM(userId, position.asset, oraclePrice[0], instrument, account)
                            : this.calMarginBalanceForIso(allocatedMargin, result[`${symbol}`]['unrealizedPNL']);
                        result[`${symbol}`]['marginRate'] = new bignumber_js_1.default(maintenanceMarginCOINM)
                            .div(new bignumber_js_1.default(marginBalanceCOINM))
                            .times(100)
                            .toString();
                        break;
                    case order_enum_1.ContractType.USD_M:
                        if (position.isCross) {
                            allocatedMargin = new bignumber_js_1.default(position.currentQty)
                                .abs()
                                .times(new bignumber_js_1.default(oraclePrice[0]))
                                .div(new bignumber_js_1.default(position.leverage))
                                .toString();
                            result[`${symbol}`]['positionMargin'] = new bignumber_js_1.default(allocatedMargin).toString();
                            const assetPosition = await this.positionRepoReport.find({
                                where: { asset: position.asset, userId: userId, currentQty: typeorm_2.Not('0') },
                            });
                            let Ipm = '0';
                            let Tmm = '0';
                            let Upnl = '0';
                            const selectedLeverageMargin = this.getLeverageMargin(leverageMargin, checkTier);
                            for (const itemPosition of assetPosition) {
                                if (!itemPosition.isCross) {
                                    Ipm = new bignumber_js_1.default(Ipm)
                                        .plus(new bignumber_js_1.default(itemPosition.positionMargin))
                                        .plus(new bignumber_js_1.default(itemPosition.adjustMargin))
                                        .toString();
                                }
                                if (itemPosition.isCross && itemPosition.symbol !== position.symbol) {
                                    const [oraclePriceItem, itemLeverageMarginArr] = await Promise.all([
                                        this.indexService.getOraclePrices([itemPosition.symbol]),
                                        this.leverageMarginRepoReport.find({ where: { symbol: itemPosition.symbol } }),
                                    ]);
                                    const itemSideValue = +itemPosition.currentQty > 0 ? 1 : -1;
                                    const notionalValue = new bignumber_js_1.default(itemPosition.currentQty)
                                        .abs()
                                        .times(oraclePriceItem[0])
                                        .toString();
                                    const itemLeverageMargin = this.getLeverageMargin(itemLeverageMarginArr, notionalValue);
                                    Tmm = new bignumber_js_1.default(Tmm)
                                        .plus(new bignumber_js_1.default(Math.abs(+itemPosition.currentQty) *
                                        +oraclePriceItem[0] *
                                        (itemLeverageMargin.maintenanceMarginRate / 100)).minus(new bignumber_js_1.default(itemLeverageMargin.maintenanceAmount)))
                                        .toString();
                                    Upnl = new bignumber_js_1.default(Upnl)
                                        .plus(new bignumber_js_1.default(itemPosition.currentQty)
                                        .abs()
                                        .times(new bignumber_js_1.default(oraclePriceItem[0]).minus(new bignumber_js_1.default(itemPosition.entryPrice)))
                                        .times(itemSideValue))
                                        .toString();
                                }
                            }
                            const numerator = new bignumber_js_1.default(account.balance)
                                .minus(new bignumber_js_1.default(Ipm))
                                .minus(new bignumber_js_1.default(Tmm))
                                .plus(new bignumber_js_1.default(Upnl))
                                .plus(new bignumber_js_1.default(selectedLeverageMargin.maintenanceAmount))
                                .minus(new bignumber_js_1.default(sideValue).times(new bignumber_js_1.default(position.currentQty).abs()).times(position.entryPrice));
                            const denominator = new bignumber_js_1.default((Math.abs(+position.currentQty) * selectedLeverageMargin.maintenanceMarginRate) / 100).minus(new bignumber_js_1.default(sideValue * Math.abs(+position.currentQty)));
                            result[`${symbol}`]['liquidationPrice'] = new bignumber_js_1.default(numerator)
                                .div(new bignumber_js_1.default(denominator))
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
                        }
                        else {
                            allocatedMargin = new bignumber_js_1.default(position.positionMargin).plus(position.adjustMargin).toString();
                            result[`${symbol}`]['positionMargin'] = new bignumber_js_1.default(allocatedMargin).toString();
                        }
                        console.log({ allocatedMargin, position, indexPrice, oraclePrice, result });
                        result[`${symbol}`]['unrealizedPNL'] = new bignumber_js_1.default(Math.abs(+position.currentQty) * (+oraclePrice[0] - +position.entryPrice) * sideValue).toString();
                        const maintenanceMarginUSDM = this.calMaintenanceMargin(leverageMargin, checkTier, position, oraclePrice[0], order_enum_1.ContractType.USD_M);
                        const marginBalanceUSDM = position.isCross
                            ? await this.calMarginBalanceForCrossUSDM(userId, position.asset, oraclePrice[0], account)
                            : this.calMarginBalanceForIso(allocatedMargin, result[`${symbol}`]['unrealizedPNL']);
                        result[`${symbol}`]['marginRate'] = new bignumber_js_1.default(maintenanceMarginUSDM)
                            .div(new bignumber_js_1.default(marginBalanceUSDM))
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
};
PositionService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(position_history_repository_1.PositionHistoryRepository, 'master')),
    tslib_1.__param(3, typeorm_1.InjectRepository(funding_history_repository_1.FundingHistoryRepository, 'master')),
    tslib_1.__param(4, typeorm_1.InjectRepository(margin_history_repository_1.MarginHistoryRepository, 'master')),
    tslib_1.__param(6, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(8, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'report')),
    tslib_1.__param(9, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'master')),
    tslib_1.__param(10, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(11, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(12, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'report')),
    tslib_1.__param(13, typeorm_1.InjectRepository(user_margin_mode_repository_1.UserMarginModeRepository, 'report')),
    tslib_1.__param(14, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__param(15, typeorm_1.InjectRepository(leverage_margin_repository_1.LeverageMarginRepository, 'report')),
    tslib_1.__param(20, typeorm_1.InjectRepository(market_data_repository_1.MarketDataRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [position_repository_1.PositionRepository,
        position_repository_1.PositionRepository,
        position_history_repository_1.PositionHistoryRepository,
        funding_history_repository_1.FundingHistoryRepository,
        margin_history_repository_1.MarginHistoryRepository,
        account_service_1.AccountService, Object, kafka_client_1.KafkaClient,
        order_repository_1.OrderRepository,
        order_repository_1.OrderRepository,
        instrument_repository_1.InstrumentRepository,
        account_repository_1.AccountRepository,
        trading_rules_repository_1.TradingRulesRepository,
        user_margin_mode_repository_1.UserMarginModeRepository,
        user_repository_1.UserRepository,
        leverage_margin_repository_1.LeverageMarginRepository,
        instrument_service_1.InstrumentService,
        nestjs_redis_1.RedisService,
        trading_rule_service_1.TradingRulesService,
        index_service_1.IndexService,
        market_data_repository_1.MarketDataRepository])
], PositionService);
exports.PositionService = PositionService;
//# sourceMappingURL=position.service.js.map