"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistoryRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const login_history_entity_1 = require("../entities/login-history.entity");
let LoginHistoryRepository = class LoginHistoryRepository extends typeorm_1.Repository {
};
LoginHistoryRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(login_history_entity_1.LoginHistoryEntity)
], LoginHistoryRepository);
exports.LoginHistoryRepository = LoginHistoryRepository;
//# sourceMappingURL=login-history.repository.js.map