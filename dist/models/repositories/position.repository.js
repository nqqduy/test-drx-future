"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionRepository = void 0;
const tslib_1 = require("tslib");
const position_entity_1 = require("../entities/position.entity");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
let PositionRepository = class PositionRepository extends base_repository_1.BaseRepository {
    async findPositionByUserId(userId, symbol) {
        const position = await this.createQueryBuilder('position')
            .select('*')
            .where('position.userId = :userId', { userId })
            .andWhere('position.currentQty <> 0 ')
            .andWhere('position.symbol = :symbol', { symbol })
            .getRawOne();
        return position;
    }
};
PositionRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(position_entity_1.PositionEntity)
], PositionRepository);
exports.PositionRepository = PositionRepository;
//# sourceMappingURL=position.repository.js.map