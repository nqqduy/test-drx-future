"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const nestjs_redis_1 = require("nestjs-redis");
const orderbook_const_1 = require("./orderbook.const");
const orderbook_service_1 = require("./orderbook.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const socket_emitter_1 = require("../../shares/helpers/socket-emitter");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
let OrderbookConsole = class OrderbookConsole {
    constructor(cacheManager, kafkaClient, redisService) {
        this.cacheManager = cacheManager;
        this.kafkaClient = kafkaClient;
        this.redisService = redisService;
    }
    async publish() {
        const topic = kafka_enum_1.KafkaTopics.orderbook_output;
        await this.kafkaClient.consume(topic, kafka_enum_1.KafkaGroups.orderbook, async (data) => {
            const { symbol, orderbook, changes } = data;
            await this.cacheManager.set(orderbook_service_1.OrderbookService.getOrderbookKey(symbol), orderbook, { ttl: orderbook_const_1.ORDERBOOK_TTL });
            const dt = Math.floor(new Date().getTime() / 1000);
            await this.cacheManager.set(`${orderbook_service_1.OrderbookService.getOrderbookKey(symbol)}${String(dt - (dt % 60))}`, orderbook, {
                ttl: orderbook_const_1.ORDERBOOK_PREVIOUS_TTL,
            });
            socket_emitter_1.SocketEmitter.getInstance().emitOrderbook(changes, symbol);
        });
        return new Promise(() => { });
    }
    async delOrderbookCache() {
        const keyOrderbookCache = await this.redisService.getClient().keys('*orderbook_*');
        if (keyOrderbookCache === null || keyOrderbookCache === void 0 ? void 0 : keyOrderbookCache.length) {
            await Promise.all([keyOrderbookCache.map((item) => this.redisService.getClient().del(item))]);
        }
    }
    async delOrderbookCacheBySymbol(symbol) {
        await this.redisService.getClient().del(`orderbook_${symbol}`);
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'orderbook:publish',
        description: 'Publish orderbook',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrderbookConsole.prototype, "publish", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'del:orderbook:all',
        description: 'delete orderbook cache',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrderbookConsole.prototype, "delOrderbookCache", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'del:orderbook <symbol>',
        description: 'delete orderbook cache',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderbookConsole.prototype, "delOrderbookCacheBySymbol", null);
OrderbookConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(0, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, kafka_client_1.KafkaClient,
        nestjs_redis_1.RedisService])
], OrderbookConsole);
exports.OrderbookConsole = OrderbookConsole;
//# sourceMappingURL=orderbook.console.js.map