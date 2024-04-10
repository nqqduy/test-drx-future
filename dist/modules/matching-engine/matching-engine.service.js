"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const matching_config_1 = require("../../configs/matching.config");
const account_entity_1 = require("../../models/entities/account.entity");
const funding_history_entity_1 = require("../../models/entities/funding-history.entity");
const margin_history_1 = require("../../models/entities/margin-history");
const order_entity_1 = require("../../models/entities/order.entity");
const position_history_entity_1 = require("../../models/entities/position-history.entity");
const position_entity_1 = require("../../models/entities/position.entity");
const trade_entity_1 = require("../../models/entities/trade.entity");
const transaction_entity_1 = require("../../models/entities/transaction.entity");
const account_repository_1 = require("../../models/repositories/account.repository");
const funding_history_repository_1 = require("../../models/repositories/funding-history.repository");
const funding_repository_1 = require("../../models/repositories/funding.repository");
const margin_history_repository_1 = require("../../models/repositories/margin-history.repository");
const order_repository_1 = require("../../models/repositories/order.repository");
const position_history_repository_1 = require("../../models/repositories/position-history.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const trade_repository_1 = require("../../models/repositories/trade.repository");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const account_service_1 = require("../account/account.service");
const funding_service_1 = require("../funding/funding.service");
const index_service_1 = require("../index/index.service");
const instrument_service_1 = require("../instrument/instrument.service");
const base_engine_service_1 = require("./base-engine.service");
const helper_1 = require("./helper");
const matching_engine_const_1 = require("./matching-engine.const");
const order_service_1 = require("../order/order.service");
const position_service_1 = require("../position/position.service");
const trade_service_1 = require("../trade/trade.service");
const transaction_service_1 = require("../transaction/transaction.service");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const order_enum_1 = require("../../shares/enums/order.enum");
const transaction_enum_1 = require("../../shares/enums/transaction.enum");
const user_margin_mode_repository_1 = require("../../models/repositories/user-margin-mode.repository");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const leverage_margin_service_1 = require("../leverage-margin/leverage-margin.service");
const trading_rules_repository_1 = require("../../models/repositories/trading-rules.repository");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const bignumber_js_1 = require("bignumber.js");
const ticker_const_1 = require("../ticker/ticker.const");
const instrument_enum_1 = require("../../shares/enums/instrument.enum");
const user_entity_1 = require("../../models/entities/user.entity");
let MatchingEngineService = class MatchingEngineService extends base_engine_service_1.BaseEngineService {
    constructor(accountService, fundingService, indexService, instrumentService, orderService, positionService, tradeService, transactionService, leverageMarginService, kafkaClient, accountRepository, accountRepoReport, instrumentRepoReport, positionRepository, orderRepository, tradeRepository, transactionRepository, fundingRepoMaster, fundingHistoryRepoMaster, positionHistoryRepoMaster, marginHistoryRepoMaster, userMarginModeRepoMaster, cacheManager, tradingRuleRepoReport) {
        super();
        this.accountService = accountService;
        this.fundingService = fundingService;
        this.indexService = indexService;
        this.instrumentService = instrumentService;
        this.orderService = orderService;
        this.positionService = positionService;
        this.tradeService = tradeService;
        this.transactionService = transactionService;
        this.leverageMarginService = leverageMarginService;
        this.kafkaClient = kafkaClient;
        this.accountRepository = accountRepository;
        this.accountRepoReport = accountRepoReport;
        this.instrumentRepoReport = instrumentRepoReport;
        this.positionRepository = positionRepository;
        this.orderRepository = orderRepository;
        this.tradeRepository = tradeRepository;
        this.transactionRepository = transactionRepository;
        this.fundingRepoMaster = fundingRepoMaster;
        this.fundingHistoryRepoMaster = fundingHistoryRepoMaster;
        this.positionHistoryRepoMaster = positionHistoryRepoMaster;
        this.marginHistoryRepoMaster = marginHistoryRepoMaster;
        this.userMarginModeRepoMaster = userMarginModeRepoMaster;
        this.cacheManager = cacheManager;
        this.tradingRuleRepoReport = tradingRuleRepoReport;
    }
    async initializeEngine(producer) {
        const lastOrderId = await this.orderService.getLastOrderId();
        const lastPositionId = await this.positionService.getLastPositionId();
        const lastTradeId = await this.tradeService.getLastTradeId();
        const lastMarginHistoryId = await this.marginHistoryRepoMaster.getLastId();
        const lastPositionHistoryId = await this.positionHistoryRepoMaster.getLastId();
        const lastFundingHistoryId = await this.fundingHistoryRepoMaster.getLastId();
        const command = {
            code: matching_engine_const_1.CommandCode.INITIALIZE_ENGINE,
            data: {
                lastOrderId,
                lastPositionId,
                lastTradeId,
                lastMarginHistoryId,
                lastPositionHistoryId,
                lastFundingHistoryId,
            },
        };
        await producer.send({ topic: kafka_enum_1.KafkaTopics.matching_engine_preload, messages: [{ value: JSON.stringify(command) }] });
    }
    async loadInstruments(producer) {
        const instruments = await this.instrumentService.find();
        const task = [];
        for (const instrument of instruments) {
            task.push(this.cacheManager.set(`${matching_engine_const_1.PREFIX_ASSET}${instrument.symbol}`, instrument.contractType === instrument_enum_1.InstrumentTypes.USD_M ? instrument.quoteCurrency : instrument.rootSymbol, { ttl: 0 }));
        }
        await Promise.all([
            task,
            this.sendData(producer, kafka_enum_1.KafkaTopics.matching_engine_preload, matching_engine_const_1.CommandCode.UPDATE_INSTRUMENT, instruments),
        ]);
    }
    async loadInstrumentExtras(producer) {
        const instruments = await this.instrumentService.find();
        const symbols = instruments.map((instrument) => instrument.symbol);
        const tickers = await this.cacheManager.get(ticker_const_1.TICKERS_LAST_PRICE_KEY);
        const tickerObject = tickers !== null
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
        await this.sendData(producer, kafka_enum_1.KafkaTopics.matching_engine_preload, matching_engine_const_1.CommandCode.UPDATE_INSTRUMENT_EXTRA, instrumentExtras);
    }
    async loadAccounts(producer) {
        const loader = async (fromId, size) => {
            return await this.accountService.findBatch(fromId, size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.CREATE_ACCOUNT, kafka_enum_1.KafkaTopics.matching_engine_preload);
    }
    async loadPositions(producer) {
        const loader = async (fromId, size) => {
            return await this.positionService.findBatch(fromId, size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.LOAD_POSITION, kafka_enum_1.KafkaTopics.matching_engine_preload);
    }
    async loadPositionHistories(producer) {
        const date = new Date(Date.now() - matching_config_1.MatchingEngineConfig.positionHistoryTime);
        const positionHistory = await this.positionService.findHistoryBefore(date);
        const firstId = (positionHistory === null || positionHistory === void 0 ? void 0 : positionHistory.id) || 0;
        const loader = async (fromId, size) => {
            return await this.positionService.findHistoryBatch(Math.max(firstId, fromId), size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.LOAD_POSITION_HISTORY, kafka_enum_1.KafkaTopics.matching_engine_preload);
        await this.savePositionHistoryTimestamp(date.getTime());
    }
    async loadFundingHistories(producer) {
        const date = new Date(Date.now() - matching_config_1.MatchingEngineConfig.fundingHistoryTime);
        const fundingHistory = await this.fundingService.findHistoryBefore(date);
        const firstId = (fundingHistory === null || fundingHistory === void 0 ? void 0 : fundingHistory.id) || 0;
        const loader = async (fromId, size) => {
            return await this.fundingService.findHistoryBatch(Math.max(firstId, fromId), size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.LOAD_FUNDING_HISTORY, kafka_enum_1.KafkaTopics.matching_engine_preload);
        await this.saveFundingHistoryTimestamp(date.getTime());
    }
    async loadOrders(producer) {
        await this.loadOrderByStatus(order_enum_1.OrderStatus.ACTIVE, producer);
        await this.loadOrderByStatus(order_enum_1.OrderStatus.UNTRIGGERED, producer);
        await this.loadOrderByStatus(order_enum_1.OrderStatus.PENDING, producer);
    }
    async loadOrderByStatus(status, producer) {
        const loader = async (fromId, size) => {
            return await this.orderService.findOrderBatch(status, fromId, size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.LOAD_ORDER, kafka_enum_1.KafkaTopics.matching_engine_preload);
    }
    async loadDeposits(producer) {
        const yesterday = new Date(Date.now() - 86400000);
        const loader = async (fromId, size) => {
            return await this.transactionService.findRecentDeposits(yesterday, fromId, size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.DEPOSIT, kafka_enum_1.KafkaTopics.matching_engine_preload);
    }
    async loadWithdrawals(producer) {
        const loader = async (fromId, size) => {
            return await this.transactionService.findPendingWithdrawals(fromId, size);
        };
        await this.loadData(producer, loader, matching_engine_const_1.CommandCode.WITHDRAW, kafka_enum_1.KafkaTopics.matching_engine_preload);
    }
    async loadLeverageMargin(producer) {
        const leverageMargins = await this.leverageMarginService.findAll();
        await this.sendData(producer, kafka_enum_1.KafkaTopics.matching_engine_preload, matching_engine_const_1.CommandCode.LOAD_LEVERAGE_MARGIN, leverageMargins);
    }
    async loadTradingRules(producer) {
        const tradingRules = await this.tradingRuleRepoReport.find();
        await this.sendData(producer, kafka_enum_1.KafkaTopics.matching_engine_preload, matching_engine_const_1.CommandCode.LOAD_TRADING_RULE, tradingRules);
    }
    async startEngine(producer) {
        const command = { code: matching_engine_const_1.CommandCode.START_ENGINE };
        await producer.send({ topic: kafka_enum_1.KafkaTopics.matching_engine_preload, messages: [{ value: JSON.stringify(command) }] });
    }
    async saveAccounts(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.accounts.length > 0) {
                entities.push(...command.accounts.map((item) => helper_1.convertDateFields(new account_entity_1.AccountEntity(), item)));
            }
        }
        await this.accountRepository.insertOrUpdate(entities);
    }
    async savePositions(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.positions.length > 0) {
                entities.push(...command.positions.map((item) => {
                    delete item.orders;
                    return helper_1.convertDateFields(new position_entity_1.PositionEntity(), item);
                }));
            }
        }
        await this.positionRepository.insertOrUpdate(entities);
    }
    async saveOrders(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.orders.length > 0) {
                entities.push(...command.orders.map((item) => helper_1.convertDateFieldsForOrders(new order_entity_1.OrderEntity(), item)));
            }
        }
        await this.orderRepository.insertOrUpdate(entities);
    }
    async saveTrades(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.trades.length > 0) {
                entities.push(...command.trades.map((item) => helper_1.convertDateFields(new trade_entity_1.TradeEntity(), item)));
            }
        }
        entities.forEach(async (entity) => {
            await Promise.all([
                this.transactionRepository.insert({
                    symbol: entity.symbol,
                    status: transaction_enum_1.TransactionStatus.APPROVED,
                    accountId: entity.buyAccountId,
                    asset: entity.buyOrder.asset,
                    type: transaction_enum_1.TransactionType.TRADING_FEE,
                    amount: entity.buyFee,
                    userId: entity.buyUserId,
                    contractType: entity.contractType,
                }),
                this.transactionRepository.insert({
                    symbol: entity.symbol,
                    status: transaction_enum_1.TransactionStatus.APPROVED,
                    accountId: entity.sellAccountId,
                    asset: entity.sellOrder.asset,
                    type: transaction_enum_1.TransactionType.TRADING_FEE,
                    amount: entity.sellFee,
                    userId: entity.sellUserId,
                    contractType: entity.contractType,
                }),
            ]);
            if (entity.realizedPnlOrderBuy) {
                await this.transactionRepository.insert({
                    symbol: entity.symbol,
                    status: transaction_enum_1.TransactionStatus.APPROVED,
                    accountId: entity.buyAccountId,
                    asset: entity.sellOrder.asset,
                    type: transaction_enum_1.TransactionType.REALIZED_PNL,
                    amount: entity.realizedPnlOrderBuy,
                    userId: entity.buyUserId,
                    contractType: entity.contractType,
                });
            }
            if (entity.realizedPnlOrderSell) {
                await this.transactionRepository.insert({
                    symbol: entity.symbol,
                    status: transaction_enum_1.TransactionStatus.APPROVED,
                    accountId: entity.sellAccountId,
                    asset: entity.sellOrder.asset,
                    type: transaction_enum_1.TransactionType.REALIZED_PNL,
                    amount: entity.realizedPnlOrderSell,
                    userId: entity.sellUserId,
                    contractType: entity.contractType,
                });
            }
            let asset;
            if (entity.symbol.includes('USDM')) {
                asset = entity.symbol.split('USDM')[0];
            }
            else if (entity.symbol.includes('USDT')) {
                asset = 'USDT';
            }
            else {
                asset = 'USD';
            }
            console.log('Check asset: ', asset, entity);
            const [accountSell, accountBuy] = await Promise.all([
                this.accountRepoReport.findOne(entity.sellAccountId),
                this.accountRepoReport.findOne(entity.buyAccountId),
            ]);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.future_referral, {
                data: {
                    buyerId: accountBuy.userId,
                    sellerId: accountSell.userId,
                    buyerFee: entity.buyFee,
                    sellerFee: entity.sellFee,
                    asset: asset === null || asset === void 0 ? void 0 : asset.toString().toLowerCase(),
                },
            });
            if (!entity.note && entity.contractType === instrument_enum_1.InstrumentTypes.USD_M) {
                await Promise.all([
                    this.kafkaClient.send(kafka_enum_1.KafkaTopics.future_reward_center, {
                        data: [
                            {
                                userId: accountSell.userId,
                                volume: new bignumber_js_1.default(entity.price).times(entity.quantity).toString(),
                                symbol: entity.symbol,
                            },
                            {
                                userId: accountBuy.userId,
                                volume: new bignumber_js_1.default(entity.price).times(entity.quantity).toString(),
                                symbol: entity.symbol,
                            },
                        ],
                    }),
                ]);
            }
        });
        await this.tradeRepository.insertOrUpdate(entities);
    }
    async saveTransactions(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.transactions.length > 0) {
                entities.push(...command.transactions.map((item) => helper_1.convertDateFields(new transaction_entity_1.TransactionEntity(), item)));
            }
        }
        await this.transactionRepository.insertOrUpdate(entities);
        const acceptWithdrawEntities = entities.filter((entity) => entity.status === transaction_enum_1.TransactionStatus.APPROVED && entity.type === transaction_enum_1.TransactionType.WITHDRAWAL);
        if (acceptWithdrawEntities.length) {
            await Promise.all(acceptWithdrawEntities.map(async (entity) => {
                try {
                    const { userId } = await this.accountRepoReport.findOne({
                        where: {
                            id: entity.accountId,
                        },
                    });
                    await this.kafkaClient.send(kafka_enum_1.KafkaTopics.spot_transfer, {
                        userId: +userId,
                        from: 'future',
                        to: 'main',
                        amount: +entity.amount,
                        asset: `${entity.asset}`.toLowerCase(),
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }));
        }
    }
    async savePositionHistories(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.positionHistories.length > 0) {
                entities.push(...command.positionHistories.map((item) => helper_1.convertDateFields(new position_history_entity_1.PositionHistoryEntity(), item)));
            }
        }
        await this.positionRepository.insertOrUpdate(entities);
    }
    async saveFunding(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.fundingHistories.length > 0) {
                entities.push(...command.fundingHistories.map((item) => helper_1.convertFundingHistoriesDateFields(new funding_history_entity_1.FundingHistoryEntity(), item)));
            }
            if (command.code === matching_engine_const_1.CommandCode.PAY_FUNDING && command.fundingHistories.length === 0) {
                const symbol = command.data['symbol'];
                const time = new Date(command.data['time']);
                await this.fundingRepoMaster.update({ symbol, time }, { paid: true });
            }
        }
        await this.fundingHistoryRepoMaster.insertOrUpdate(entities);
        entities.forEach(async (entity) => {
            await this.transactionRepository.insert({
                symbol: entity.symbol,
                status: transaction_enum_1.TransactionStatus.APPROVED,
                accountId: entity.accountId,
                asset: entity.asset,
                type: transaction_enum_1.TransactionType.FUNDING_FEE,
                amount: entity.amount,
                contractType: entity.contractType,
                userId: entity.userId,
            });
        });
    }
    async saveMarginHistory(commands) {
        const entities = [];
        for (const command of commands) {
            if (command.marginHistories.length > 0) {
                entities.push(...command.marginHistories.map((item) => helper_1.convertDateFields(new margin_history_1.MarginHistoryEntity(), item)));
            }
        }
        await this.marginHistoryRepoMaster.insertOrUpdate(entities);
    }
    async saveMarginLeverage(commands) {
        var _a;
        const entities = [];
        for (const command of commands) {
            if (((_a = command.adjustLeverage) === null || _a === void 0 ? void 0 : _a.status) === 'SUCCESS') {
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
        await Promise.all(entities.map((entity) => {
            if (entity.id) {
                const id = entity.id;
                delete entity.id;
                this.userMarginModeRepoMaster.update(id, entity);
            }
            else {
                entity.id = null;
                this.userMarginModeRepoMaster.insert(entity);
            }
        }));
    }
    async savePositionHistoryTimestamp(timestamp) {
        await this.cacheManager.set(matching_engine_const_1.POSITION_HISTORY_TIMESTAMP_KEY, timestamp, {
            ttl: Number.MAX_SAFE_INTEGER,
        });
    }
    async saveFundingHistoryTimestamp(timestamp) {
        await this.cacheManager.set(matching_engine_const_1.FUNDING_HISTORY_TIMESTAMP_KEY, timestamp, {
            ttl: Number.MAX_SAFE_INTEGER,
        });
    }
};
MatchingEngineService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(10, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(11, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(12, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(13, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'master')),
    tslib_1.__param(14, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'master')),
    tslib_1.__param(15, typeorm_1.InjectRepository(trade_repository_1.TradeRepository, 'master')),
    tslib_1.__param(16, typeorm_1.InjectRepository(transaction_repository_1.TransactionRepository, 'master')),
    tslib_1.__param(17, typeorm_1.InjectRepository(funding_repository_1.FundingRepository, 'master')),
    tslib_1.__param(18, typeorm_1.InjectRepository(funding_history_repository_1.FundingHistoryRepository, 'master')),
    tslib_1.__param(19, typeorm_1.InjectRepository(position_history_repository_1.PositionHistoryRepository, 'master')),
    tslib_1.__param(20, typeorm_1.InjectRepository(margin_history_repository_1.MarginHistoryRepository, 'master')),
    tslib_1.__param(21, typeorm_1.InjectRepository(user_margin_mode_repository_1.UserMarginModeRepository, 'master')),
    tslib_1.__param(22, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(23, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [account_service_1.AccountService,
        funding_service_1.FundingService,
        index_service_1.IndexService,
        instrument_service_1.InstrumentService,
        order_service_1.OrderService,
        position_service_1.PositionService,
        trade_service_1.TradeService,
        transaction_service_1.TransactionService,
        leverage_margin_service_1.LeverageMarginService,
        kafka_client_1.KafkaClient,
        account_repository_1.AccountRepository,
        account_repository_1.AccountRepository,
        instrument_repository_1.InstrumentRepository,
        position_repository_1.PositionRepository,
        order_repository_1.OrderRepository,
        trade_repository_1.TradeRepository,
        transaction_repository_1.TransactionRepository,
        funding_repository_1.FundingRepository,
        funding_history_repository_1.FundingHistoryRepository,
        position_history_repository_1.PositionHistoryRepository,
        margin_history_repository_1.MarginHistoryRepository,
        user_margin_mode_repository_1.UserMarginModeRepository, Object, trading_rules_repository_1.TradingRulesRepository])
], MatchingEngineService);
exports.MatchingEngineService = MatchingEngineService;
//# sourceMappingURL=matching-engine.service.js.map