"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeverageMarginRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const leverage_margin_entity_1 = require("../entities/leverage-margin.entity");
const base_repository_1 = require("./base.repository");
let LeverageMarginRepository = class LeverageMarginRepository extends base_repository_1.BaseRepository {
    async getLeverageMargin(args) {
        const query = Object.assign({}, args);
        const data = this.findOne({
            where: query,
        });
        return data;
    }
};
LeverageMarginRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(leverage_margin_entity_1.LeverageMarginEntity)
], LeverageMarginRepository);
exports.LeverageMarginRepository = LeverageMarginRepository;
//# sourceMappingURL=leverage-margin.repository.js.map