"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestBlockService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const latest_block_entity_1 = require("../../models/entities/latest-block.entity");
const latest_block_repository_1 = require("../../models/repositories/latest-block.repository");
let LatestBlockService = class LatestBlockService {
    constructor(latestBlockRepoMaster) {
        this.latestBlockRepoMaster = latestBlockRepoMaster;
    }
    async saveLatestBlock(service, block, latestBlockRepository) {
        if (!latestBlockRepository) {
            latestBlockRepository = this.latestBlockRepoMaster;
        }
        await latestBlockRepository.saveLatestBlock(service, block);
    }
    async getLatestBlock(service) {
        let latestBlock = await this.latestBlockRepoMaster.findOne({ service });
        if (!latestBlock) {
            latestBlock = new latest_block_entity_1.LatestBlockEntity();
            latestBlock.service = service;
            await this.latestBlockRepoMaster.insert(latestBlock);
        }
        return latestBlock;
    }
    async updateLatestBlockStatus(latestBlock) {
        latestBlock.updatedAt = new Date();
        return await this.latestBlockRepoMaster.save(latestBlock);
    }
};
LatestBlockService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(latest_block_repository_1.LatestBlockRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [latest_block_repository_1.LatestBlockRepository])
], LatestBlockService);
exports.LatestBlockService = LatestBlockService;
//# sourceMappingURL=latest-block.service.js.map