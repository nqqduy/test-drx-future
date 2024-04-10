"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const instrument_entity_1 = require("../../models/entities/instrument.entity");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const create_instrument_dto_1 = require("./dto/create-instrument.dto");
const update_instrument_dto_1 = require("./dto/update-instrument.dto");
const exceptions_1 = require("../../shares/exceptions");
const market_fee_repository_1 = require("../../models/repositories/market_fee.repository");
const trading_rules_repository_1 = require("../../models/repositories/trading-rules.repository");
const leverage_margin_repository_1 = require("../../models/repositories/leverage-margin.repository");
const typeorm_2 = require("typeorm");
const trading_rules_entity_1 = require("../../models/entities/trading_rules.entity");
const leverage_margin_entity_1 = require("../../models/entities/leverage-margin.entity");
const instrument_const_1 = require("./instrument.const");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const class_transformer_1 = require("class-transformer");
const nestjs_redis_1 = require("nestjs-redis");
const order_enum_1 = require("../../shares/enums/order.enum");
const account_repository_1 = require("../../models/repositories/account.repository");
const instrument_enum_1 = require("../../shares/enums/instrument.enum");
const account_enum_1 = require("../../shares/enums/account.enum");
const index_const_1 = require("../index/index.const");
const funding_const_1 = require("../funding/funding.const");
const leverage_margin_constants_1 = require("../leverage-margin/leverage-margin.constants");
const trading_rules_constants_1 = require("../trading-rules/trading-rules.constants");
const funding_service_1 = require("../funding/funding.service");
let InstrumentService = class InstrumentService {
    constructor(instrumentRepoReport, instrumentRepoMaster, marketFeeRepoReport, marketFeeRepoMaster, accountRepositoryMaster, accountRepositoryReport, tradingRulesMaster, tradingRulesReport, leverageMarginRepoReport, leverageMarginRepoMaster, connection, cacheManager, redisService, kafkaClient, fundingService) {
        this.instrumentRepoReport = instrumentRepoReport;
        this.instrumentRepoMaster = instrumentRepoMaster;
        this.marketFeeRepoReport = marketFeeRepoReport;
        this.marketFeeRepoMaster = marketFeeRepoMaster;
        this.accountRepositoryMaster = accountRepositoryMaster;
        this.accountRepositoryReport = accountRepositoryReport;
        this.tradingRulesMaster = tradingRulesMaster;
        this.tradingRulesReport = tradingRulesReport;
        this.leverageMarginRepoReport = leverageMarginRepoReport;
        this.leverageMarginRepoMaster = leverageMarginRepoMaster;
        this.connection = connection;
        this.cacheManager = cacheManager;
        this.redisService = redisService;
        this.kafkaClient = kafkaClient;
        this.fundingService = fundingService;
    }
    async getAllInstruments(query) {
        const queryBuilder = this.instrumentRepoReport.createQueryBuilder('instruments');
        if (query === null || query === void 0 ? void 0 : query.type) {
            queryBuilder.where(`instruments.contractType = :type`, { type: query.type });
        }
        const instruments = await queryBuilder.getMany();
        return instruments;
    }
    async getInstrumentsById(id) {
        const instrument = await this.instrumentRepoReport.findOne({
            where: { id: id },
            relations: ['marketFee'],
        });
        if (!instrument) {
            throw new common_1.HttpException('Instrument not found', common_1.HttpStatus.NOT_FOUND);
        }
        return instrument;
    }
    async getInstrumentsBySymbol(symbol) {
        const instrument = await this.instrumentRepoReport.findOne({ symbol });
        if (!instrument) {
            throw new common_1.HttpException(exceptions_1.httpErrors.INSTRUMENT_DOES_NOT_EXIST, common_1.HttpStatus.NOT_FOUND);
        }
        return instrument;
    }
    async getTradingRuleBySymbol(symbol) {
        const tradingRule = await this.tradingRulesReport.findOne({ symbol });
        if (!tradingRule) {
            throw new common_1.HttpException(exceptions_1.httpErrors.TRADING_RULES_DOES_NOT_EXIST, common_1.HttpStatus.NOT_FOUND);
        }
        return tradingRule;
    }
    async createInstrument(contractDto) {
        const { instrument, leverageMargin, tradingRules } = contractDto;
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const instrumentDb = await this.instrumentRepoReport.findOne({
                where: {
                    symbol: instrument.symbol,
                },
            });
            if (instrumentDb) {
                throw new common_1.HttpException(exceptions_1.httpErrors.SYMBOL_ALREADY_EXIST, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!instrument.multiplier) {
                instrument.multiplier = instrument_enum_1.INSTRUMENT.MULTIPLIER_DEFAULT_VALUE;
            }
            const newInstrument = await queryRunner.manager.save(instrument_entity_1.InstrumentEntity, Object.assign(Object.assign({}, instrument), { name: instrument.symbol, symbol: instrument.underlyingSymbol, quoteCurrency: instrument.underlyingSymbol.includes('USDT') ? 'USDT' : 'USD', contractSize: '0.00000100', lotSize: '100.00000000', maxOrderQty: 1000 }));
            const newTradingRule = await queryRunner.manager.save(trading_rules_entity_1.TradingRulesEntity, Object.assign(Object.assign({}, tradingRules), { symbol: instrument.underlyingSymbol }));
            let asset = '';
            if (newInstrument.symbol.includes('USDM')) {
                asset = newInstrument.symbol.split('USDM')[0];
            }
            else if (newInstrument.symbol.includes('USDT')) {
                asset = 'USDT';
            }
            else {
                asset = 'USD';
            }
            const userIdInsuranceAccount = account_enum_1.USER_ID_INSURANCE_ACCOUNT.DEFAULT;
            let insuranceAccount = await this.accountRepositoryReport.findOne({
                where: {
                    userId: userIdInsuranceAccount,
                    asset: asset,
                },
            });
            if (!insuranceAccount) {
                insuranceAccount = await this.accountRepositoryMaster.save({
                    userId: userIdInsuranceAccount,
                    asset,
                    balance: '1000000',
                });
            }
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.CREATE_ACCOUNT,
                data: insuranceAccount,
            });
            const leverageMarginToSave = leverageMargin.map((lm) => (Object.assign(Object.assign({}, lm), { symbol: instrument.underlyingSymbol })));
            const newLeverageMargin = await queryRunner.manager.save(leverage_margin_entity_1.LeverageMarginEntity, leverageMarginToSave);
            await queryRunner.commitTransaction();
            const [oraclePrice, indexPrice, fundingRate] = await Promise.all([
                this.redisService.getClient().get(`${index_const_1.ORACLE_PRICE_PREFIX}${newInstrument.symbol}`),
                this.redisService.getClient().get(`${index_const_1.INDEX_PRICE_PREFIX}${newInstrument.symbol}`),
                this.fundingService.fundingRate(newInstrument.symbol),
            ]);
            await Promise.all([
                this.redisService.getClient().del(`${trading_rules_constants_1.TRADING_RULES_CACHE_NO_LIMIT}`),
                this.redisService.getClient().del(`${leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE}`),
                this.redisService.getClient().del(`${instrument_const_1.INSTRUMENT_SYMBOL_CACHE}`),
                this.redisService.getClient().del(`${instrument_const_1.INSTRUMENT_SYMBOL_COIN_M_CACHE}`),
                this.cacheManager.set(`${index_const_1.LAST_PRICE_PREFIX}${newInstrument.symbol}`, indexPrice, {
                    ttl: Number.MAX_SAFE_INTEGER,
                }),
            ]);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.UPDATE_INSTRUMENT,
                data: newInstrument,
            });
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.UPDATE_INSTRUMENT_EXTRA,
                data: {
                    symbol: newInstrument.symbol,
                    oraclePrice,
                    indexPrice,
                    fundingRate,
                },
            });
            return { newInstrument, newTradingRule, newLeverageMargin };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
        finally {
            await queryRunner.release();
        }
    }
    async sendData(producer, topic, code, entities) {
        const messages = entities.map((entity) => ({
            value: class_transformer_1.serialize({ code, data: entity }),
        }));
        await producer.send({ topic, messages });
    }
    async getContractList(input) {
        const page = Number(input.page);
        const size = Number(input.size);
        const query = this.instrumentRepoReport
            .createQueryBuilder('i')
            .select([
            'i.name as symbol',
            'i.id as id',
            'i.rootSymbol as collateralAsset',
            'i.underlyingSymbol as underlyingSymbol',
            'i.makerFee as makerFee',
            'i.takerFee as takerFee',
            'i.tickSize as tickSize',
            'i.maxPrice as maxPrice',
            'i.multiplier as multiplier',
            'i.minPriceMovement as minPriceMovement',
            'i.maxFiguresForSize as maxFiguresForSize',
            'i.maxFiguresForPrice as maxFiguresForPrice',
            'i.impactMarginNotional as impactMarginNotional',
            'tr.minPrice as minPrice',
            'tr.limitOrderPrice as limitOrderPrice',
            'tr.floorRatio as floorRatio',
            'tr.minOrderAmount as minOrderAmount',
            'tr.maxOrderAmount as maxOrderAmount',
            'tr.minNotional as minNotional',
            'tr.maxNotinal as maxNotinal',
            'tr.liqClearanceFee as liqClearanceFee',
            'tr.maxLeverage as maxLeverage',
        ])
            .leftJoin('trading_rules', 'tr', 'tr.symbol = i.symbol')
            .orderBy('i.createdAt', 'DESC')
            .limit(size)
            .offset(size * (page - 1));
        if (input.search) {
            query.andWhere('i.symbol LIKE :symbol', { symbol: `%${input.search}%` });
        }
        if (input.contractType && input.contractType !== order_enum_1.ContractType.ALL) {
            query.andWhere('i.contractType = :contractType', { contractType: input.contractType });
        }
        const [list, count] = await Promise.all([query.getRawMany(), query.getCount()]);
        return { list, count };
    }
    async detailContract(underlyingSymbol) {
        const queryInstrumet = this.instrumentRepoReport
            .createQueryBuilder('i')
            .select([
            'i.name as symbol',
            'i.rootSymbol as collateralAsset',
            'i.underlyingSymbol as underlyingSymbol',
            'i.makerFee as makerFee',
            'i.takerFee as takerFee',
            'i.tickSize as tickSize',
            'i.maxPrice as maxPrice',
            'i.multiplier as multiplier',
            'i.minPriceMovement as minPriceMovement',
            'i.maxFiguresForSize as maxFiguresForSize',
            'i.maxFiguresForPrice as maxFiguresForPrice',
            'i.impactMarginNotional as impactMarginNotional',
            'tr.minPrice as minPrice',
            'tr.limitOrderPrice as limitOrderPrice',
            'tr.floorRatio as floorRatio',
            'tr.minOrderAmount as minOrderAmount',
            'tr.maxOrderAmount as maxOrderAmount',
            'tr.minNotional as minNotional',
            'tr.maxNotinal as maxNotinal',
            'tr.liqClearanceFee as liqClearanceFee',
            'tr.maxLeverage as maxLeverage',
        ])
            .leftJoin('trading_rules', 'tr', 'tr.symbol = i.symbol')
            .where('i.symbol = :symbol', { symbol: underlyingSymbol });
        const queryTradingTier = this.leverageMarginRepoReport
            .createQueryBuilder('lm')
            .select('lm.*')
            .where('lm.symbol = :symbol', { symbol: underlyingSymbol });
        const [instrument, tradingTier] = await Promise.all([queryInstrumet.getRawOne(), queryTradingTier.getRawMany()]);
        return { instrument, tradingTier };
    }
    async updateContract(updateContractDto) {
        try {
            const { id, symbol } = updateContractDto;
            const findInstrumet = await this.instrumentRepoReport.findOne({ where: { id: id } });
            if (!findInstrumet) {
                throw new common_1.HttpException('Instrument not found', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.instrumentRepoReport.update({ id: id }, { name: symbol });
        }
        catch (error) {
            throw new common_1.HttpException('Can not update instrument', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateInstrument(instrumentId, updateInstrumentDto) {
        let instrument = await this.instrumentRepoReport.findOne({ id: instrumentId });
        try {
            instrument = await this.instrumentRepoMaster.save(Object.assign(Object.assign({}, instrument), updateInstrumentDto));
        }
        catch (error) {
            throw new common_1.HttpException('Can not update instrument', common_1.HttpStatus.BAD_REQUEST);
        }
        return instrument;
    }
    async find() {
        return this.instrumentRepoReport.find();
    }
    async findBySymbol(symbol) {
        return this.instrumentRepoReport.findOne({
            symbol,
        });
    }
    async createMarketFeeByInstrument(createMarketFeeDto) {
        const instrument = await this.getInstrumentsById(createMarketFeeDto.instrumentId);
        if (instrument.marketFee)
            throw new common_1.HttpException('Instrument already exists market fee', common_1.HttpStatus.BAD_REQUEST);
        return this.marketFeeRepoMaster.save(createMarketFeeDto);
    }
    async updateMarketFeeByInstrument(updateMarketFeeDto) {
        const instrument = await this.getInstrumentsById(updateMarketFeeDto.instrumentId);
        if (!instrument.marketFee)
            throw new common_1.HttpException('Instrument not exists market fee', common_1.HttpStatus.BAD_REQUEST);
        return this.marketFeeRepoMaster.save(Object.assign(Object.assign({}, instrument.marketFee), updateMarketFeeDto));
    }
    async getAllSymbolInstrument() {
        const instruments = (await this.cacheManager.get(instrument_const_1.INSTRUMENT_SYMBOL_CACHE)) || [];
        if (instruments.length) {
            return instruments;
        }
        const results = await this.instrumentRepoReport.find({
            where: [{ contractType: instrument_const_1.USDM }, { contractType: instrument_const_1.COINM }],
        });
        const symbols = [];
        results.forEach((result) => {
            symbols.push(result.symbol);
        });
        await this.cacheManager.set(instrument_const_1.INSTRUMENT_SYMBOL_CACHE, symbols);
        return symbols;
    }
    async getAllTickerInstrument() {
        const instruments = (await this.cacheManager.get(instrument_const_1.INSTRUMENT_CACHE)) || [];
        if (instruments.length) {
            return instruments;
        }
        const results = await this.instrumentRepoReport.find({
            where: [{ contractType: instrument_const_1.USDM }, { contractType: instrument_const_1.COINM }],
        });
        const data = [];
        results.forEach((result) => {
            data.push({ symbol: result.symbol, contractType: result.contractType, name: result.name });
        });
        await this.cacheManager.set(instrument_const_1.INSTRUMENT_CACHE, data);
        return data;
    }
    async getAllSymbolCoinMInstrument() {
        const instruments = (await this.cacheManager.get(instrument_const_1.INSTRUMENT_SYMBOL_COIN_M_CACHE)) || [];
        if (instruments.length) {
            return instruments;
        }
        const results = await this.instrumentRepoReport.find({ where: { contractType: instrument_const_1.COINM } });
        const symbols = [];
        results.forEach((result) => {
            symbols.push(result.symbol);
        });
        await this.cacheManager.set(instrument_const_1.INSTRUMENT_SYMBOL_COIN_M_CACHE, symbols);
        return symbols;
    }
    async getIndexPrices(symbols) {
        if (!symbols.length) {
            return [];
        }
        const keys = symbols.map((symbol) => `${index_const_1.INDEX_PRICE_PREFIX}${symbol}`);
        return await this.redisService.getClient().mget(keys);
    }
    async getOraclePrices(symbols) {
        if (!symbols.length) {
            return [];
        }
        const keys = symbols.map((symbol) => `${index_const_1.ORACLE_PRICE_PREFIX}${symbol}`);
        return await this.redisService.getClient().mget(keys);
    }
    async getFundingRates(symbols) {
        if (!symbols.length) {
            return [];
        }
        const keys = symbols.map((symbol) => `${funding_const_1.FUNDING_PREFIX}${symbol}`);
        return await this.redisService.getClient().mget(keys);
    }
};
InstrumentService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(market_fee_repository_1.MarketFeeRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(market_fee_repository_1.MarketFeeRepository, 'master')),
    tslib_1.__param(4, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'master')),
    tslib_1.__param(5, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(6, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'master')),
    tslib_1.__param(7, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'report')),
    tslib_1.__param(8, typeorm_1.InjectRepository(leverage_margin_repository_1.LeverageMarginRepository, 'report')),
    tslib_1.__param(9, typeorm_1.InjectRepository(leverage_margin_repository_1.LeverageMarginRepository, 'master')),
    tslib_1.__param(10, typeorm_1.InjectConnection('master')),
    tslib_1.__param(11, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [instrument_repository_1.InstrumentRepository,
        instrument_repository_1.InstrumentRepository,
        market_fee_repository_1.MarketFeeRepository,
        market_fee_repository_1.MarketFeeRepository,
        account_repository_1.AccountRepository,
        account_repository_1.AccountRepository,
        trading_rules_repository_1.TradingRulesRepository,
        trading_rules_repository_1.TradingRulesRepository,
        leverage_margin_repository_1.LeverageMarginRepository,
        leverage_margin_repository_1.LeverageMarginRepository,
        typeorm_2.Connection, Object, nestjs_redis_1.RedisService,
        kafka_client_1.KafkaClient,
        funding_service_1.FundingService])
], InstrumentService);
exports.InstrumentService = InstrumentService;
//# sourceMappingURL=instrument.service.js.map