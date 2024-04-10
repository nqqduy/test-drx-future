"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const assets_repository_1 = require("../../models/repositories/assets.repository");
const assets_constants_1 = require("./assets.constants");
const order_enum_1 = require("../../shares/enums/order.enum");
const transaction_const_1 = require("../transaction/transaction.const");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
let AssetsService = class AssetsService {
    constructor(assetsRepoReport, assetsRepoMaster, instrumentRepoReport, cacheManager) {
        this.assetsRepoReport = assetsRepoReport;
        this.assetsRepoMaster = assetsRepoMaster;
        this.instrumentRepoReport = instrumentRepoReport;
        this.cacheManager = cacheManager;
    }
    async findAllAssets(contractType) {
        if (contractType == order_enum_1.ContractType.COIN_M) {
            const assetsCache = await this.cacheManager.get(transaction_const_1.AssetType.COIN_M);
            if ((assetsCache === null || assetsCache === void 0 ? void 0 : assetsCache.length) > 0) {
                return assetsCache;
            }
            await this.cacheManager.set(transaction_const_1.AssetType.COIN_M, transaction_const_1.LIST_SYMBOL_COINM, { ttl: assets_constants_1.ASSETS_TTL });
            return transaction_const_1.LIST_SYMBOL_COINM;
        }
        const assetsCache = await this.cacheManager.get(transaction_const_1.AssetType.USD_M);
        if ((assetsCache === null || assetsCache === void 0 ? void 0 : assetsCache.length) > 0) {
            return assetsCache;
        }
        await this.cacheManager.set(transaction_const_1.AssetType.USD_M, transaction_const_1.LIST_SYMBOL_USDM, { ttl: assets_constants_1.ASSETS_TTL });
        return transaction_const_1.LIST_SYMBOL_USDM;
    }
};
AssetsService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(assets_repository_1.AssetsRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(assets_repository_1.AssetsRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(3, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [assets_repository_1.AssetsRepository,
        assets_repository_1.AssetsRepository,
        instrument_repository_1.InstrumentRepository, Object])
], AssetsService);
exports.AssetsService = AssetsService;
//# sourceMappingURL=assets.service.js.map