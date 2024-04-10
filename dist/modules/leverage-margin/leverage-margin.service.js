"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeverageMarginService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leverage_margin_entity_1 = require("../../models/entities/leverage-margin.entity");
const leverage_margin_repository_1 = require("../../models/repositories/leverage-margin.repository");
const base_engine_service_1 = require("../matching-engine/base-engine.service");
const leverage_margin_constants_1 = require("./leverage-margin.constants");
const order_enum_1 = require("../../shares/enums/order.enum");
let LeverageMarginService = class LeverageMarginService extends base_engine_service_1.BaseEngineService {
    constructor(leverageMarginRepoReport, leverageMarginRepoMaster, cacheManager) {
        super();
        this.leverageMarginRepoReport = leverageMarginRepoReport;
        this.leverageMarginRepoMaster = leverageMarginRepoMaster;
        this.cacheManager = cacheManager;
    }
    async findAll() {
        const leverageMarginCache = await this.cacheManager.get(leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE);
        if (leverageMarginCache) {
            return leverageMarginCache;
        }
        const leverageMargin = await this.leverageMarginRepoReport.find();
        await this.cacheManager.set(leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE, leverageMargin, { ttl: leverage_margin_constants_1.LEVERAGE_MARGIN_TTL });
        return leverageMargin;
    }
    async findBy(arg) {
        const leverageMargin = await this.leverageMarginRepoReport.find(arg);
        return leverageMargin;
    }
    async findAllByContract(contractType) {
        const leverageMarginCache = await this.cacheManager.get(`${leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE}_${contractType}`);
        if (leverageMarginCache) {
            return leverageMarginCache;
        }
        const leverageMargin = await this.leverageMarginRepoReport.find({
            where: {
                contractType: contractType,
            },
        });
        await this.cacheManager.set(`${leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE}_${contractType}`, leverageMargin, {
            ttl: leverage_margin_constants_1.LEVERAGE_MARGIN_TTL,
        });
        return leverageMargin;
    }
    async upsertLeverageMargin(leverageMarginDto) {
        const hasLeverageMargin = await this.leverageMarginRepoReport.getLeverageMargin({
            tier: leverageMarginDto.tier,
        });
        if (!hasLeverageMargin) {
            return await this.leverageMarginRepoMaster.save(leverageMarginDto);
        }
        Object.keys(leverageMarginDto).map((item) => {
            hasLeverageMargin[`${item}`] = leverageMarginDto[`${item}`];
        });
        await this.leverageMarginRepoMaster.save(hasLeverageMargin);
        const leverageMargin = await this.leverageMarginRepoReport.findOne({
            tier: leverageMarginDto.tier,
        });
        const leverageMarginCache = await this.leverageMarginRepoReport.find();
        await this.cacheManager.set(leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE, leverageMarginCache, { ttl: leverage_margin_constants_1.LEVERAGE_MARGIN_TTL });
        return leverageMargin;
    }
    async findAllAndGetInstrumentData() {
        const leverageMarginCache = await this.cacheManager.get(leverage_margin_constants_1.LEVERAGE_MARGIN_CACHE);
        if (leverageMarginCache) {
            return leverageMarginCache;
        }
    }
};
LeverageMarginService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(leverage_margin_repository_1.LeverageMarginRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(leverage_margin_repository_1.LeverageMarginRepository, 'master')),
    tslib_1.__param(2, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [leverage_margin_repository_1.LeverageMarginRepository,
        leverage_margin_repository_1.LeverageMarginRepository, Object])
], LeverageMarginService);
exports.LeverageMarginService = LeverageMarginService;
//# sourceMappingURL=leverage-margin.service.js.map