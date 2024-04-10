"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const order_enum_1 = require("../../shares/enums/order.enum");
const trading_rule_service_1 = require("../trading-rules/trading-rule.service");
const coin_info_service_1 = require("../coin-info/coin-info.service");
const leverage_margin_service_1 = require("../leverage-margin/leverage-margin.service");
const instrument_service_1 = require("../instrument/instrument.service");
let MasterDataService = class MasterDataService {
    constructor(instrumentRepoReport, instrumentRepoMaster, cacheManager, tradingRulesService, coinInfoService, leverageMarginService, instrumentService) {
        this.instrumentRepoReport = instrumentRepoReport;
        this.instrumentRepoMaster = instrumentRepoMaster;
        this.cacheManager = cacheManager;
        this.tradingRulesService = tradingRulesService;
        this.coinInfoService = coinInfoService;
        this.leverageMarginService = leverageMarginService;
        this.instrumentService = instrumentService;
    }
    async getMasterData() {
        const orderType = Object.assign(Object.assign({}, order_enum_1.OrderType), order_enum_1.TpSlType);
        const [tradingRules, coinInfo, leverageMargin, symbols, coinM] = await Promise.all([
            this.tradingRulesService.getAllTradingRulesNoLimit(),
            this.coinInfoService.getAllCoinInfo(),
            this.leverageMarginService.findAll(),
            this.instrumentService.getAllSymbolInstrument(),
            this.instrumentService.getAllSymbolCoinMInstrument(),
        ]);
        return {
            orderType,
            symbols,
            tradingRules,
            coinInfo,
            leverageMargin,
            coinM,
        };
    }
};
MasterDataService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'master')),
    tslib_1.__param(2, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [instrument_repository_1.InstrumentRepository,
        instrument_repository_1.InstrumentRepository, Object, trading_rule_service_1.TradingRulesService,
        coin_info_service_1.CoinInfoService,
        leverage_margin_service_1.LeverageMarginService,
        instrument_service_1.InstrumentService])
], MasterDataService);
exports.MasterDataService = MasterDataService;
//# sourceMappingURL=master-data.service.js.map