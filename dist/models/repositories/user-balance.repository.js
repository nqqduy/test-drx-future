"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBalanceRepository = void 0;
const tslib_1 = require("tslib");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
const user_balance_entity_1 = require("../entities/user_balance.entity");
let UserBalanceRepository = class UserBalanceRepository extends base_repository_1.BaseRepository {
};
UserBalanceRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(user_balance_entity_1.UserBalanceEntity)
], UserBalanceRepository);
exports.UserBalanceRepository = UserBalanceRepository;
//# sourceMappingURL=user-balance.repository.js.map