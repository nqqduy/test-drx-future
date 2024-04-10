"use strict";
var MatchingEngineConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_console_1 = require("nestjs-console");
const kafka_1 = require("../../configs/kafka");
const account_entity_1 = require("../../models/entities/account.entity");
const instrument_entity_1 = require("../../models/entities/instrument.entity");
const order_entity_1 = require("../../models/entities/order.entity");
const position_entity_1 = require("../../models/entities/position.entity");
const trade_entity_1 = require("../../models/entities/trade.entity");
const account_repository_1 = require("../../models/repositories/account.repository");
const index_service_1 = require("../index/index.service");
const instrument_service_1 = require("../instrument/instrument.service");
const helper_1 = require("./helper");
const matching_engine_const_1 = require("./matching-engine.const");
const matching_engine_service_1 = require("./matching-engine.service");
const notifications_service_1 = require("./notifications.service");
const order_service_1 = require("../order/order.service");
const position_service_1 = require("../position/position.service");
const instrument_enum_1 = require("../../shares/enums/instrument.enum");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const socket_emitter_1 = require("../../shares/helpers/socket-emitter");
const utils_1 = require("../../shares/helpers/utils");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const balance_service_1 = require("../balance/balance.service");
let MatchingEngineConsole = MatchingEngineConsole_1 = class MatchingEngineConsole {
    constructor(balanceService, positionService, orderService, matchingEngineService, instrumentService, indexService, notificationService, kafkaClient, accountRepository, cacheManager) {
        this.balanceService = balanceService;
        this.positionService = positionService;
        this.orderService = orderService;
        this.matchingEngineService = matchingEngineService;
        this.instrumentService = instrumentService;
        this.indexService = indexService;
        this.notificationService = notificationService;
        this.kafkaClient = kafkaClient;
        this.accountRepository = accountRepository;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(MatchingEngineConsole_1.name);
    }
    async load() {
        await this.kafkaClient.delete([kafka_enum_1.KafkaTopics.matching_engine_preload]);
        let laggedGroup = await this.getLaggedGroup();
        while (laggedGroup) {
            this.logger.log(`Waiting for topic ${kafka_enum_1.KafkaTopics.matching_engine_output}, group ${laggedGroup.group} to be consumed. Current lag: ${laggedGroup.combinedLag}`);
            await utils_1.sleep(1000);
            laggedGroup = await this.getLaggedGroup();
        }
        const producer = kafka_1.kafka.producer();
        await producer.connect();
        await this.matchingEngineService.initializeEngine(producer);
        await this.matchingEngineService.loadInstruments(producer);
        await this.matchingEngineService.loadInstrumentExtras(producer);
        await this.matchingEngineService.loadLeverageMargin(producer);
        await this.matchingEngineService.loadAccounts(producer);
        await this.matchingEngineService.loadPositions(producer);
        await this.matchingEngineService.loadPositionHistories(producer);
        await this.matchingEngineService.loadFundingHistories(producer);
        await this.matchingEngineService.loadDeposits(producer);
        await this.matchingEngineService.loadWithdrawals(producer);
        await this.matchingEngineService.loadOrders(producer);
        await this.matchingEngineService.loadTradingRules(producer);
        await this.matchingEngineService.startEngine(producer);
        await producer.disconnect();
    }
    async getLaggedGroup() {
        const groups = [
            'matching_engine_saver_accounts',
            'matching_engine_saver_positions',
            'matching_engine_saver_orders',
            'matching_engine_saver_trades',
            'matching_engine_saver_transactions',
            'matching_engine_saver_position_histories',
            'matching_engine_saver_funding',
            'matching_engine_saver_margin_histories',
        ];
        for (const group of groups) {
            const combinedLag = await this.kafkaClient.getCombinedLag(kafka_enum_1.KafkaTopics.matching_engine_output, group);
            if (combinedLag > 0) {
                return { group, combinedLag };
            }
        }
    }
    async saveAccounts() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_accounts, (commands) => this.matchingEngineService.saveAccounts(commands));
    }
    async savePositions() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_positions, (commands) => this.matchingEngineService.savePositions(commands));
    }
    async saveOrders() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_orders, (commands) => this.matchingEngineService.saveOrders(commands));
    }
    async saveTrades() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_trades, (commands) => this.matchingEngineService.saveTrades(commands));
    }
    async saveTransactions() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_transactions, (commands) => this.matchingEngineService.saveTransactions(commands));
    }
    async savePositionHistories() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_position_histories, (commands) => this.matchingEngineService.savePositionHistories(commands));
    }
    async saveFunding() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_funding, (commands) => this.matchingEngineService.saveFunding(commands));
    }
    async saveMarginHistories() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_margin_histories, (commands) => this.matchingEngineService.saveMarginHistory(commands));
    }
    async saveMarginLeverage() {
        await this.saveEntities(kafka_enum_1.KafkaGroups.matching_engine_saver_margin_leverage, (commands) => this.matchingEngineService.saveMarginLeverage(commands));
    }
    async getOffset(offset, topic) {
        await this.kafkaClient.getMessageAtOffset(offset, topic).then(console.error);
    }
    async saveEntities(groupId, callback) {
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.matching_engine_output, groupId, async (commands) => {
            await callback(commands);
        }, { fromBeginning: true });
        return new Promise(() => { });
    }
    async notify() {
        const instrumentMap = await this.getInstrumentMap();
        let accounts = [];
        let positions = [];
        let orders = [];
        let trades = [];
        let notifications = [];
        let adjustLeverage = [];
        let adjustMarginPosition = [];
        await this.kafkaClient.consume(kafka_enum_1.KafkaTopics.matching_engine_output, kafka_enum_1.KafkaGroups.matching_engine_notifier, async (commands) => {
            for (const command of commands) {
                if (command.adjustLeverage) {
                    adjustLeverage.push(command.adjustLeverage);
                }
                if (command.orders.length > 0) {
                    orders.push(...command.orders.map((item) => helper_1.convertDateFields(new order_entity_1.OrderEntity(), Object.assign(Object.assign({}, item), { isShowToast: command.adjustLeverage ? false : true }))));
                }
                if (command.code === matching_engine_const_1.CommandCode.ADJUST_MARGIN_POSITION) {
                    adjustMarginPosition.push(Object.assign({}, command.data));
                }
                if (command.accounts.length > 0) {
                    accounts.push(...command.accounts.map((item) => helper_1.convertDateFields(new account_entity_1.AccountEntity(), item)));
                }
                if (command.positions.length > 0) {
                    positions.push(...command.positions.map((item) => helper_1.convertDateFields(new position_entity_1.PositionEntity(), item)));
                }
                if (command.trades.length > 0) {
                    trades.push(...command.trades.map((item) => helper_1.convertDateFields(new trade_entity_1.TradeEntity(), item)));
                }
                const commandNotifications = await this.notificationService.createNotifications(command, instrumentMap);
                notifications.push(...commandNotifications);
            }
            console.log('NOTIFY MATCHING ENGINE');
            await this.notifyAccounts(accounts);
            await this.notifyPositions(positions);
            await this.notifyOrders(orders);
            this.notifyTrades(trades);
            await this.notifyNotifications(notifications);
            await this.notifyAdjustLeverage(adjustLeverage);
            await this.notifyAdjustMarginPosition(adjustMarginPosition);
            accounts = [];
            positions = [];
            orders = [];
            trades = [];
            notifications = [];
            adjustLeverage = [];
            adjustMarginPosition = [];
        }, { fromBeginning: true });
        return new Promise(() => { });
    }
    async getInstrumentMap() {
        const instruments = await this.instrumentService.getAllInstruments();
        return instruments.reduce((map, instrument) => {
            map[instrument.symbol] = instrument;
            return map;
        }, {});
    }
    async notifyAccounts(accounts) {
        await Promise.all(accounts.map(async (account) => {
            socket_emitter_1.SocketEmitter.getInstance().emitAccount(account.userId, account);
        }));
    }
    async notifyPositions(positions) {
        const map = positions.reduce((map, position) => {
            map[position.id] = position;
            return map;
        }, {});
        for (const id in map) {
            const position = map[id];
            socket_emitter_1.SocketEmitter.getInstance().emitPosition(position, position.userId);
        }
    }
    async notifyAdjustLeverage(adjustLeverages) {
        for (const adjustLeverage of adjustLeverages) {
            socket_emitter_1.SocketEmitter.getInstance().emitAdjustLeverage(adjustLeverage, +adjustLeverage.userId);
        }
    }
    async notifyAdjustMarginPosition(marginPositions) {
        for (const marginPosition of marginPositions) {
            socket_emitter_1.SocketEmitter.getInstance().emitAdjustMarginPosition(marginPosition, marginPosition.userId);
        }
    }
    async notifyOrders(orders) {
        const map = orders.reduce((map, order) => {
            map[order.id] = order;
            return map;
        }, {});
        const orderMap = Object.values(map).reduce((map, order) => {
            const list = map[order.userId] || [];
            list.push(order);
            map[order.userId] = list;
            return map;
        }, {});
        for (const id in orderMap) {
            const orders = orderMap[id];
            socket_emitter_1.SocketEmitter.getInstance().emitOrders(orders, +id);
        }
    }
    async loadMissingAccounts(currentIds, accountMap) {
        const missingAccountIds = currentIds.filter((accountId) => !accountMap[accountId]);
        if (missingAccountIds.length > 0) {
            const missingAccounts = await this.accountRepository.getAccountsByIds(missingAccountIds);
            accountMap = missingAccounts.reduce((map, account) => {
                map[account.userId] = account.userId;
                return map;
            }, accountMap);
        }
        return accountMap;
    }
    notifyTrades(trades) {
        const map = trades.reduce((map, trade) => {
            const list = map[trade.symbol] || [];
            list.push(trade);
            map[trade.symbol] = list;
            return map;
        }, {});
        for (const symbol in map) {
            socket_emitter_1.SocketEmitter.getInstance().emitTrades(map[symbol], symbol);
        }
    }
    async notifyNotifications(notifications) {
        const map = notifications.reduce((map, notification) => {
            const list = map[notification.userId] || [];
            list.push(notification);
            map[notification.userId] = list;
            return map;
        }, {});
        for (const userId in map) {
            socket_emitter_1.SocketEmitter.getInstance().emitNotifications(map[userId], +userId);
        }
    }
    async savePrefix() {
        const instruments = await this.instrumentService.find();
        const task = [];
        for (const instrument of instruments) {
            task.push(this.cacheManager.set(`${matching_engine_const_1.PREFIX_ASSET}${instrument.symbol}`, instrument.contractType === instrument_enum_1.InstrumentTypes.USD_M ? instrument.quoteCurrency : instrument.rootSymbol, { ttl: 0 }));
        }
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:load',
        description: 'Load data into matching engine',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "load", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-accounts',
        description: 'Save accounts',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveAccounts", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-positions',
        description: 'Save positions',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "savePositions", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-orders',
        description: 'Save orders',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveOrders", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-trades',
        description: 'Save trades',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveTrades", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-transactions',
        description: 'Save transactions',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveTransactions", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-position-histories',
        description: 'Save position histories',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "savePositionHistories", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-funding',
        description: 'Save funding',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveFunding", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-margin-histories',
        description: 'Save margin histories',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveMarginHistories", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-margin-leverage',
        description: 'Save margin mode and leverage',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "saveMarginLeverage", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:get-offset [offset] [topic]',
        description: 'Save margin mode and leverage',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "getOffset", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:notify',
        description: 'Notify output from matching engine via socket',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "notify", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'matching-engine:save-prefix',
        description: 'Save margin mode and leverage',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MatchingEngineConsole.prototype, "savePrefix", null);
MatchingEngineConsole = MatchingEngineConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(8, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(9, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [balance_service_1.BalanceService,
        position_service_1.PositionService,
        order_service_1.OrderService,
        matching_engine_service_1.MatchingEngineService,
        instrument_service_1.InstrumentService,
        index_service_1.IndexService,
        notifications_service_1.NotificationService,
        kafka_client_1.KafkaClient,
        account_repository_1.AccountRepository, Object])
], MatchingEngineConsole);
exports.MatchingEngineConsole = MatchingEngineConsole;
//# sourceMappingURL=matching-engine.console.js.map