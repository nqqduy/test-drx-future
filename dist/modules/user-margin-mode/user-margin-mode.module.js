"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMarginModeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const database_common_1 = require("../../models/database-common");
const account_module_1 = require("../account/account.module");
const user_margin_mode_controller_1 = require("./user-margin-mode.controller");
const user_margin_mode_service_1 = require("./user-margin-mode.service");
let UserMarginModeModule = class UserMarginModeModule {
};
UserMarginModeModule = tslib_1.__decorate([
    common_1.Module({
        imports: [database_common_1.DatabaseCommonModule, account_module_1.AccountsModule],
        controllers: [user_margin_mode_controller_1.UserMarginModeController],
        providers: [user_margin_mode_service_1.UserMarginModeService],
        exports: [user_margin_mode_service_1.UserMarginModeService],
    })
], UserMarginModeModule);
exports.UserMarginModeModule = UserMarginModeModule;
//# sourceMappingURL=user-margin-mode.module.js.map