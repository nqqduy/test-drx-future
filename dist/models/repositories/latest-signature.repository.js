"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatestSignatureRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const latest_signature_entity_1 = require("../entities/latest-signature.entity");
const app_repository_1 = require("../../shares/helpers/app.repository");
let LatestSignatureRepository = class LatestSignatureRepository extends app_repository_1.AppRepository {
};
LatestSignatureRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(latest_signature_entity_1.LatestSignatureEntity)
], LatestSignatureRepository);
exports.LatestSignatureRepository = LatestSignatureRepository;
//# sourceMappingURL=latest-signature.repository.js.map