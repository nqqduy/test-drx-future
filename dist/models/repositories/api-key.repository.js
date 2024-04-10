"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const app_repository_1 = require("../../shares/helpers/app.repository");
const api_key_entity_1 = require("../entities/api-key.entity");
let ApiKeyRepository = class ApiKeyRepository extends app_repository_1.AppRepository {
};
ApiKeyRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(api_key_entity_1.ApiKey)
], ApiKeyRepository);
exports.ApiKeyRepository = ApiKeyRepository;
//# sourceMappingURL=api-key.repository.js.map