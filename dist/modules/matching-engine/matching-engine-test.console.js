"use strict";
var MatchingEngineTestConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineTestConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const nestjs_console_1 = require("nestjs-console");
const kafka_1 = require("../../configs/kafka");
const account_entity_1 = require("../../models/entities/account.entity");
const order_entity_1 = require("../../models/entities/order.entity");
const account_repository_1 = require("../../models/repositories/account.repository");
const account_service_1 = require("../account/account.service");
const index_service_1 = require("../index/index.service");
const instrument_service_1 = require("../instrument/instrument.service");
const matching_engine_const_1 = require("./matching-engine.const");
const matching_engine_service_1 = require("./matching-engine.service");
const order_service_1 = require("../order/order.service");
const position_service_1 = require("../position/position.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const order_enum_1 = require("../../shares/enums/order.enum");
const socket_emitter_1 = require("../../shares/helpers/socket-emitter");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
let MatchingEngineTestConsole = MatchingEngineTestConsole_1 = class MatchingEngineTestConsole {
    constructor(accountService, positionService, orderService, matchingEngineService, instrumentService, indexService, kafkaClient, accountRepository) {
        this.accountService = accountService;
        this.positionService = positionService;
        this.orderService = orderService;
        this.matchingEngineService = matchingEngineService;
        this.instrumentService = instrumentService;
        this.indexService = indexService;
        this.kafkaClient = kafkaClient;
        this.accountRepository = accountRepository;
        this.logger = new common_1.Logger(MatchingEngineTestConsole_1.name);
    }
    async testOraclePrice(symbol, oraclePrice) {
        await this.indexService.saveOraclePrice(symbol, oraclePrice);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.LIQUIDATE,
            data: { symbol, oraclePrice },
        });
    }
    async testIndexPrice(symbol, indexPrice) {
        await this.indexService.saveIndexPrice(symbol, indexPrice);
        await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
            code: matching_engine_const_1.CommandCode.LIQUIDATE,
            data: { symbol, indexPrice },
        });
    }
    async testRedis() {
        socket_emitter_1.SocketEmitter.getInstance().emitTrades([], 'ABCUSD');
    }
    async testPerformance() {
        const userCount = 100000;
        const orderCount = 1000000;
        const producer = kafka_1.kafka.producer();
        await producer.connect();
        await this.createAccounts(producer, userCount);
        await this.createOrder(producer, userCount, orderCount);
    }
    async createAccounts(producer, userCount) {
        const batchSize = 1000;
        for (let batch = 0; batch < userCount / batchSize; batch++) {
            const accounts = [];
            for (let i = 0; i < batchSize; i++) {
                const account = new account_entity_1.AccountEntity();
                account.id = batch * batchSize + i;
                account.createdAt = new Date();
                account.updatedAt = account.createdAt;
                accounts.push(account);
            }
            const messages = accounts.map((entity) => ({
                value: class_transformer_1.serialize({ code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT, data: entity }),
            }));
            await producer.send({
                topic: 'order_input_test',
                messages,
            });
        }
    }
    async createOrder(producer, userCount, orderCount) {
        const batchSize = 2000;
        for (let batch = 0; batch < orderCount / batchSize; batch++) {
            const orders = [];
            for (let i = 0; i < batchSize; i++) {
                const order = new order_entity_1.OrderEntity();
                order.id = batch * batchSize + i;
                order.side = Math.random() > 0.5 ? order_enum_1.OrderSide.BUY : order_enum_1.OrderSide.SELL;
                order.price = (Math.floor(Math.random() * 10000) +
                    50000 +
                    (order.side === order_enum_1.OrderSide.BUY ? 1000 : -1000)).toString();
                order.quantity = (Math.floor(Math.random() * 10000) / 10000).toString();
                order.remaining = order.quantity;
                order.userId = Math.floor(Math.random() * userCount);
                order.type = order_enum_1.OrderType.LIMIT;
                order.timeInForce = order_enum_1.OrderTimeInForce.GTC;
                order.symbol = 'BTCUSD';
                order.status = order_enum_1.OrderStatus.PENDING;
                order.createdAt = new Date();
                order.updatedAt = order.createdAt;
                orders.push(order);
            }
            const messages = orders.map((entity) => ({
                value: class_transformer_1.serialize({ code: matching_engine_const_1.CommandCode.PLACE_ORDER, data: entity }),
            }));
            await producer.send({
                topic: 'order_input_test',
                messages,
            });
        }
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:test-oracle-price <symbol> <price>',
        description: 'Test liquidate',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineTestConsole.prototype, "testOraclePrice", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:test-index-price <symbol> <price>',
        description: 'Test liquidate',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineTestConsole.prototype, "testIndexPrice", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:test-socket',
        description: 'Test socket',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineTestConsole.prototype, "testRedis", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:test-performance',
        description: 'Test performance',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineTestConsole.prototype, "testPerformance", null);
MatchingEngineTestConsole = MatchingEngineTestConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(7, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [account_service_1.AccountService,
        position_service_1.PositionService,
        order_service_1.OrderService,
        matching_engine_service_1.MatchingEngineService,
        instrument_service_1.InstrumentService,
        index_service_1.IndexService,
        kafka_client_1.KafkaClient,
        account_repository_1.AccountRepository])
], MatchingEngineTestConsole);
exports.MatchingEngineTestConsole = MatchingEngineTestConsole;
//# sourceMappingURL=matching-engine-test.console.js.map