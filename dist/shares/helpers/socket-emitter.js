"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEmitter = void 0;
const common_1 = require("@nestjs/common");
const redis_emitter_1 = require("@socket.io/redis-emitter");
const redis_1 = require("redis");
const redis_config_1 = require("../../configs/redis.config");
const account_entity_1 = require("../../models/entities/account.entity");
const order_entity_1 = require("../../models/entities/order.entity");
const position_entity_1 = require("../../models/entities/position.entity");
const trade_entity_1 = require("../../models/entities/trade.entity");
const event_gateway_1 = require("../../modules/events/event.gateway");
const matching_engine_const_1 = require("../../modules/matching-engine/matching-engine.const");
const orderbook_const_1 = require("../../modules/orderbook/orderbook.const");
const ticker_const_1 = require("../../modules/ticker/ticker.const");
class SocketEmitter {
    constructor() {
        const redisClient = redis_1.createClient(redis_config_1.redisConfig.port, redis_config_1.redisConfig.host);
        this.io = new redis_emitter_1.Emitter(redisClient);
        this.logger = new common_1.Logger(SocketEmitter.name);
    }
    static getInstance() {
        if (!SocketEmitter.instance) {
            SocketEmitter.instance = new SocketEmitter();
        }
        return SocketEmitter.instance;
    }
    emitTrades(trades, symbol) {
        this.io.to(event_gateway_1.EventGateway.getTradesRoom(symbol)).emit(`trades_${symbol}`, trades);
    }
    emitOrderbook(orderbook, symbol) {
        const data = Buffer.from(JSON.stringify(Object.assign(Object.assign({}, orderbook), { symbol })), 'binary');
        this.io.to(event_gateway_1.EventGateway.getOrderbookRoom(symbol)).emit(`orderbook_${symbol}`, data);
    }
    emitTickers(tickers) {
        this.io.emit(`tickers`, tickers);
    }
    emitAccount(userId, account) {
        this.io.to(`${userId}`).emit(`balance`, account);
    }
    emitPosition(position, userId) {
        this.io.to(`${userId}`).emit(`position`, position);
    }
    emitOrders(orders, userId) {
        console.log({ orders, userId });
        this.io.to(`${userId}`).emit(`orders`, orders);
    }
    emitNotifications(notifications, userId) {
        this.io.to(`${userId}`).emit(`notifications`, notifications);
    }
    emitAdjustLeverage(adjustLeverage, userId) {
        this.io.to(`${userId}`).emit(`adjust-leverage`, adjustLeverage);
    }
    emitAdjustMarginPosition(marginPosition, userId) {
        this.io.to(`${userId}`).emit(`margin-position`, marginPosition);
        console.log({ userId, marginPosition });
    }
}
exports.SocketEmitter = SocketEmitter;
//# sourceMappingURL=socket-emitter.js.map