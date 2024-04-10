"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingRulesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trading_rules_entity_1 = require("../../models/entities/trading_rules.entity");
const trading_rules_repository_1 = require("../../models/repositories/trading-rules.repository");
const exceptions_1 = require("../../shares/exceptions");
const lodash = require('lodash');
const trading_rules_constants_1 = require("./trading-rules.constants");
const pagination_dto_1 = require("../../shares/dtos/pagination.dto");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
let TradingRulesService = class TradingRulesService {
    constructor(tradingRulesMaster, tradingRulesReport, cacheManager, instrumentRepoReport, instrumentRepoMaster, kafkaClient) {
        this.tradingRulesMaster = tradingRulesMaster;
        this.tradingRulesReport = tradingRulesReport;
        this.cacheManager = cacheManager;
        this.instrumentRepoReport = instrumentRepoReport;
        this.instrumentRepoMaster = instrumentRepoMaster;
        this.kafkaClient = kafkaClient;
    }
    async insertOrUpdateTradingRules(input) {
        try {
            const findTradingRule = await this.tradingRulesReport.findOne({
                symbol: input.symbol,
            });
            let data = input;
            if (input.isReduceOnly == false) {
                data = lodash.omit(data, ['positionsNotional', 'ratioOfPostion', 'liqMarkPrice']);
            }
            let tradingRule;
            if (!findTradingRule) {
                tradingRule = await this.tradingRulesMaster.save(data);
            }
            else {
                await this.tradingRulesMaster.update({ symbol: input.symbol }, data);
                tradingRule = await this.tradingRulesReport.findOne({
                    symbol: input.symbol,
                });
            }
            const tradingRuleCache = await this.tradingRulesReport.find();
            await Promise.all([
                this.cacheManager.set(trading_rules_constants_1.TRADING_RULES_CACHE, tradingRuleCache, { ttl: trading_rules_constants_1.TRADING_RULES_TTL }),
                this.cacheManager.set(trading_rules_constants_1.TRADING_RULES_CACHE_NO_LIMIT, tradingRuleCache, { ttl: trading_rules_constants_1.TRADING_RULES_TTL }),
            ]);
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.LOAD_TRADING_RULE,
                data: tradingRule,
            });
            return tradingRule;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getAllTradingRules(input) {
        const tradingRulesCache = (await this.cacheManager.get(trading_rules_constants_1.TRADING_RULES_CACHE));
        if (tradingRulesCache) {
            const list = tradingRulesCache.slice((input.page - 1) * input.size, input.page * input.size);
            return { list, count: tradingRulesCache.length };
        }
        const tradingRules = await this.tradingRulesReport.find();
        await this.cacheManager.set(trading_rules_constants_1.TRADING_RULES_CACHE, tradingRules, { ttl: trading_rules_constants_1.TRADING_RULES_TTL });
        return {
            list: tradingRules.slice((input.page - 1) * input.size, input.page * input.size),
            count: tradingRules.length,
        };
    }
    async getTradingRuleByInstrumentId(symbol) {
        const tradingRulesCache = await this.cacheManager.get(`${trading_rules_constants_1.TRADING_RULES_CACHE}_${symbol}`);
        if (tradingRulesCache) {
            return tradingRulesCache;
        }
        const tradingRule = await this.tradingRulesReport.findOne({ symbol });
        if (!tradingRule) {
            throw new common_1.HttpException(exceptions_1.httpErrors.TRADING_RULES_DOES_NOT_EXIST, common_1.HttpStatus.NOT_FOUND);
        }
        const instrument = await this.instrumentRepoReport.findOne({ symbol });
        const data = Object.assign(Object.assign({}, tradingRule), instrument);
        await this.cacheManager.set(`${trading_rules_constants_1.TRADING_RULES_CACHE}_${symbol}`, data);
        return data;
    }
    async getAllTradingRulesNoLimit() {
        const tradingRulesCache = (await this.cacheManager.get(trading_rules_constants_1.TRADING_RULES_CACHE_NO_LIMIT));
        if (tradingRulesCache)
            return tradingRulesCache;
        const tradingRules = await this.tradingRulesReport.find();
        const instruments = await this.instrumentRepoReport.find();
        tradingRules.forEach((tradingRule) => {
            const ins = instruments.find((i) => i.symbol === tradingRule.symbol);
            (tradingRule['maxPrice'] = ins === null || ins === void 0 ? void 0 : ins.maxPrice),
                (tradingRule['maxFiguresForPrice'] = ins === null || ins === void 0 ? void 0 : ins.maxFiguresForPrice),
                (tradingRule['maxFiguresForSize'] = ins === null || ins === void 0 ? void 0 : ins.maxFiguresForSize);
        });
        await this.cacheManager.set(trading_rules_constants_1.TRADING_RULES_CACHE_NO_LIMIT, tradingRules, { ttl: trading_rules_constants_1.TRADING_RULES_TTL });
        return tradingRules;
    }
};
TradingRulesService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'master')),
    tslib_1.__param(1, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'report')),
    tslib_1.__param(2, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__param(3, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [trading_rules_repository_1.TradingRulesRepository,
        trading_rules_repository_1.TradingRulesRepository, Object, instrument_repository_1.InstrumentRepository,
        instrument_repository_1.InstrumentRepository,
        kafka_client_1.KafkaClient])
], TradingRulesService);
exports.TradingRulesService = TradingRulesService;
//# sourceMappingURL=trading-rule.service.js.map