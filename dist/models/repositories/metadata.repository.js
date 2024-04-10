"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const metadata_entity_1 = require("../entities/metadata.entity");
let MetadataRepository = class MetadataRepository extends typeorm_1.Repository {
};
MetadataRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(metadata_entity_1.MetadataEntity)
], MetadataRepository);
exports.MetadataRepository = MetadataRepository;
//# sourceMappingURL=metadata.repository.js.map