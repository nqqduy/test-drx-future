"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenRepository = void 0;
const tslib_1 = require("tslib");
const app_repository_1 = require("../../shares/helpers/app.repository");
const typeorm_1 = require("typeorm");
const access_tokens_entity_1 = require("../entities/access-tokens.entity");
let AccessTokenRepository = class AccessTokenRepository extends app_repository_1.AppRepository {
};
AccessTokenRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(access_tokens_entity_1.AccessToken)
], AccessTokenRepository);
exports.AccessTokenRepository = AccessTokenRepository;
//# sourceMappingURL=access-token.repository.js.map