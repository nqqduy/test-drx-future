"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const database_common_1 = require("../../models/database-common");
const user_setting_controller_1 = require("./user-setting.controller");
const user_setting_service_1 = require("./user-setting.service");
let UserSettingModule = class UserSettingModule {
};
UserSettingModule = tslib_1.__decorate([
    common_1.Module({
        imports: [database_common_1.DatabaseCommonModule],
        controllers: [user_setting_controller_1.UserSettingController],
        providers: [user_setting_service_1.UserSettingeService, common_1.Logger],
        exports: [],
    })
], UserSettingModule);
exports.UserSettingModule = UserSettingModule;
//# sourceMappingURL=user-setting.module.js.map