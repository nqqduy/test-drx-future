"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestBlockRepository = void 0;
const tslib_1 = require("tslib");
const latest_block_entity_1 = require("../entities/latest-block.entity");
const typeorm_1 = require("typeorm");
let LatestBlockRepository = class LatestBlockRepository extends typeorm_1.Repository {
    async saveLatestBlock(service, block) {
        const latestBlock = new latest_block_entity_1.LatestBlockEntity();
        latestBlock.blockNumber = block;
        latestBlock.updatedAt = new Date();
        await this.update({ service }, latestBlock);
    }
};
LatestBlockRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(latest_block_entity_1.LatestBlockEntity)
], LatestBlockRepository);
exports.LatestBlockRepository = LatestBlockRepository;
//# sourceMappingURL=latest-block.repository.js.map