"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const tslib_1 = require("tslib");
const order_entity_1 = require("../entities/order.entity");
const base_repository_1 = require("./base.repository");
const order_history_dto_1 = require("../../modules/order/dto/order-history.dto");
const order_enum_1 = require("../../shares/enums/order.enum");
const typeorm_1 = require("typeorm");
const trade_const_1 = require("../../modules/trade/trade.const");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const pagination_util_1 = require("../../shares/pagination-util");
let OrderRepository = class OrderRepository extends base_repository_1.BaseRepository {
    async findOrderBatch(status, fromId, count) {
        return this.createQueryBuilder()
            .where('id > :fromId', { fromId })
            .andWhere('status = :status', { status })
            .orderBy('id', 'ASC')
            .take(count)
            .getMany();
    }
    async findAccountOrderBatch(userId, status, fromId, count, types, cancelOrderType, contractType) {
        const query = this.createQueryBuilder()
            .where('id > :fromId', { fromId })
            .andWhere('userId = :userId', { userId })
            .andWhere('`status` = :status', { status })
            .andWhere('contractType = :contractType', { contractType });
        switch (cancelOrderType) {
            case order_enum_1.CANCEL_ORDER_TYPE.ALL:
                query.andWhere(`(type in (:types) or tpSLType in (:types))`, { types });
                break;
            case order_enum_1.CANCEL_ORDER_TYPE.LIMIT:
                query.andWhere('type = :limitType and tpSLType is null', {
                    limitType: order_enum_1.OrderType.LIMIT,
                });
                break;
            case order_enum_1.CANCEL_ORDER_TYPE.STOP:
                query.andWhere('tpSLType in (:types)', { types });
                break;
            default:
                break;
        }
        return await query.orderBy('id', 'ASC').take(count).getMany();
    }
    async getLastId() {
        const entity = await this.findOne({ where: { id: typeorm_1.LessThan(order_entity_1.MIN_ORDER_ID) }, order: { id: 'DESC' } });
        if (entity) {
            return entity.id;
        }
        else {
            return 0;
        }
    }
    async genQueryGetOrderHistory(orderHistoryDto, startTime, endTime, userId, offset, limit) {
        const query = this.createQueryBuilder('order')
            .where('userId = :userId', { userId })
            .andWhere('updatedAt BETWEEN :startTime and :endTime ', { startTime, endTime })
            .andWhere('isHidden = false')
            .andWhere('contractType = :contractType', { contractType: orderHistoryDto.contractType })
            .orderBy('updatedAt', 'DESC')
            .addOrderBy('id', 'DESC')
            .limit(limit)
            .offset(offset);
        if (orderHistoryDto.symbol) {
            query.andWhere('symbol = :symbol', { symbol: orderHistoryDto.symbol });
        }
        if (orderHistoryDto.side) {
            query.andWhere('side = :side', { side: orderHistoryDto.side });
        }
        if (orderHistoryDto.type) {
            switch (orderHistoryDto.type) {
                case order_enum_1.OrderType.LIMIT:
                case order_enum_1.OrderType.MARKET:
                    query.andWhere('note is null and type = :type and tpSLType is null', { type: orderHistoryDto.type });
                    break;
                case order_enum_1.OrderType.LIQUIDATION:
                    query.andWhere('note = :note', { note: order_enum_1.OrderType.LIQUIDATION });
                    break;
                case order_enum_1.OrderType.STOP_LOSS_MARKET:
                    query.andWhere('tpSLType = :tpSlType and isTpSlOrder = true', { tpSlType: order_enum_1.OrderType.STOP_MARKET });
                    break;
                case order_enum_1.OrderType.STOP_MARKET:
                    query.andWhere('tpSLType = :tpSlType and isTpSlOrder = false', { tpSlType: order_enum_1.OrderType.STOP_MARKET });
                    break;
                default:
                    query.andWhere('tpSLType = :type', { type: orderHistoryDto.type });
                    break;
            }
        }
        if (!orderHistoryDto.status) {
            query.andWhere(`status not in ('ACTIVE', 'PENDING', 'UNTRIGGERED')`);
            await this.genQueryGetPartiallyFilledOrder(orderHistoryDto, startTime, endTime, query, userId);
        }
        else if (orderHistoryDto.status !== order_enum_1.OrderStatus.PARTIALLY_FILLED) {
            query.andWhere('status = :status', { status: orderHistoryDto.status });
        }
        else {
            query.andWhere('remaining > 0 and remaining < quantity and status = :status', { status: order_enum_1.OrderStatus.ACTIVE });
        }
        if (orderHistoryDto.contractType) {
            query.andWhere('contractType = :contractType', { contractType: orderHistoryDto.contractType });
        }
        const [orders, count] = await Promise.all([query.getMany(), query.getCount()]);
        return { orders, count };
    }
    async getOrderHistory(orderHistoryDto, startTime, endTime, userId, paging) {
        const { offset, limit } = pagination_util_1.getQueryLimit(paging, trade_const_1.MAX_RESULT_COUNT);
        const dataOrder = await this.genQueryGetOrderHistory(orderHistoryDto, startTime, endTime, userId, offset, limit);
        return dataOrder;
    }
    async genQueryGetPartiallyFilledOrder(orderHistoryDto, startTime, endTime, query, userId) {
        const parameters = {
            status: order_enum_1.OrderStatus.ACTIVE,
            startTime,
            endTime,
            userId,
            contractType: orderHistoryDto.contractType,
        };
        let commonCondition = 'userId = :userId and  updatedAt BETWEEN :startTime and :endTime  and status = :status and (remaining > 0 and remaining < quantity) and contractType = :contractType';
        if (orderHistoryDto.type) {
            if ([order_enum_1.OrderType.LIMIT, order_enum_1.OrderType.MARKET].includes(orderHistoryDto.type)) {
                commonCondition += ' and note is null and type = :type and tpSLType is null';
            }
            else if (orderHistoryDto.type == order_enum_1.OrderType.LIQUIDATION) {
                commonCondition += ' and note = :note';
                parameters['note'] = order_enum_1.OrderType.LIQUIDATION;
            }
            else if (orderHistoryDto.type == order_enum_1.OrderType.STOP_LOSS_MARKET) {
                commonCondition += ' and tpSLType = :tpSlType and isTpSlOrder = true';
                parameters['tpSlType'] = order_enum_1.OrderType.STOP_MARKET;
            }
            else if (orderHistoryDto.type == order_enum_1.OrderType.STOP_MARKET) {
                commonCondition += ' and tpSLType = :tpSlType and isTpSlOrder = false';
                parameters['tpSlType'] = order_enum_1.OrderType.STOP_MARKET;
            }
            else {
                commonCondition += ' and note is null and tpSLType = :type';
            }
            parameters['type'] = orderHistoryDto.type;
        }
        if (orderHistoryDto.status) {
            commonCondition += ' and status = :status';
            parameters['status'] = orderHistoryDto.status;
        }
        if (orderHistoryDto.side) {
            commonCondition += ' and side = :side';
            parameters['side'] = orderHistoryDto.side;
        }
        if (orderHistoryDto.symbol) {
            commonCondition += ' and symbol = :symbol';
            parameters['symbol'] = orderHistoryDto.symbol;
        }
        query.orWhere(`(${commonCondition})`, parameters);
    }
};
OrderRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(order_entity_1.OrderEntity)
], OrderRepository);
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map