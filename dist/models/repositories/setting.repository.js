"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRepository = void 0;
const tslib_1 = require("tslib");
const setting_entity_1 = require("../entities/setting.entity");
const typeorm_1 = require("typeorm");
let SettingRepository = class SettingRepository extends typeorm_1.Repository {
};
SettingRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(setting_entity_1.SettingEntity)
], SettingRepository);
exports.SettingRepository = SettingRepository;
//# sourceMappingURL=setting.repository.js.map