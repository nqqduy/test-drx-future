"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const instrument_entity_1 = require("../entities/instrument.entity");
let InstrumentRepository = class InstrumentRepository extends typeorm_1.Repository {
};
InstrumentRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(instrument_entity_1.InstrumentEntity)
], InstrumentRepository);
exports.InstrumentRepository = InstrumentRepository;
//# sourceMappingURL=instrument.repository.js.map