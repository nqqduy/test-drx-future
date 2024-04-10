"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMarginModeRepository = void 0;
const tslib_1 = require("tslib");
const base_repository_1 = require("./base.repository");
const typeorm_1 = require("typeorm");
const user_margin_mode_entity_1 = require("../entities/user-margin-mode.entity");
let UserMarginModeRepository = class UserMarginModeRepository extends base_repository_1.BaseRepository {
};
UserMarginModeRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(user_margin_mode_entity_1.UserMarginModeEntity)
], UserMarginModeRepository);
exports.UserMarginModeRepository = UserMarginModeRepository;
//# sourceMappingURL=user-margin-mode.repository.js.map