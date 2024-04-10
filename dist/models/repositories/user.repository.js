"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const tslib_1 = require("tslib");
const user_entity_1 = require("../entities/user.entity");
const typeorm_1 = require("typeorm");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    async findUserByAccountId(accountId) {
        const user = await this.createQueryBuilder('users')
            .select('*')
            .innerJoin('accounts', 'accounts', 'accounts.userId = users.id')
            .where('accounts.id = :accountId', { accountId })
            .execute();
        if (user[0]) {
            return user[0];
        }
        else
            return null;
    }
};
UserRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(user_entity_1.UserEntity)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map