"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_console_1 = require("nestjs-console");
const assets_entity_1 = require("../../models/entities/assets.entity");
const assets_repository_1 = require("../../models/repositories/assets.repository");
let AssetsSeedCommand = class AssetsSeedCommand {
    constructor(assetsRepository) {
        this.assetsRepository = assetsRepository;
    }
    async seedAssets() {
        await this.assetsRepository
            .createQueryBuilder()
            .insert()
            .into(assets_entity_1.AssetsEntity)
            .values([
            {
                asset: 'BTCUSDT',
            },
            {
                asset: 'ETHUSDT',
            },
            {
                asset: 'BNBUSDT',
            },
            {
                asset: 'LTCUSDT',
            },
            {
                asset: 'XRPUSDT',
            },
            {
                asset: 'SOLUSDT',
            },
            {
                asset: 'TRXUSDT',
            },
            {
                asset: 'MATICUSDT',
            },
            {
                asset: 'LINKUSDT',
            },
            {
                asset: 'MANAUSDT',
            },
            {
                asset: 'FILUSDT',
            },
            {
                asset: 'ATOMUSDT',
            },
            {
                asset: 'AAVEUSDT',
            },
            {
                asset: 'DOGEUSDT',
            },
            {
                asset: 'DOTUSDT',
            },
            {
                asset: 'UNIUSDT',
            },
            {
                asset: 'ETHUSD',
            },
            {
                asset: 'BNBUSD',
            },
            {
                asset: 'LTCUSD',
            },
            {
                asset: 'XRPUSD',
            },
            {
                asset: 'USDTUSD',
            },
            {
                asset: 'SOLUSD',
            },
            {
                asset: 'TRXUSD',
            },
            {
                asset: 'MATICUSD',
            },
            {
                asset: 'LINKUSD',
            },
            {
                asset: 'MANAUSD',
            },
            {
                asset: 'FILUSD',
            },
            {
                asset: 'ATOMUSD',
            },
            {
                asset: 'AAVEUSD',
            },
            {
                asset: 'DOGEUSD',
            },
            {
                asset: 'DOTUSD',
            },
            {
                asset: 'UNIUSD',
            },
        ])
            .execute();
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'seed:assets',
        description: 'seed assets',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AssetsSeedCommand.prototype, "seedAssets", null);
AssetsSeedCommand = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(assets_repository_1.AssetsRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [assets_repository_1.AssetsRepository])
], AssetsSeedCommand);
exports.default = AssetsSeedCommand;
//# sourceMappingURL=assets.console.js.map