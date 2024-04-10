"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const setting_controller_1 = require("./setting.controller");
const setting_service_1 = require("./setting.service");
let SettingModule = class SettingModule {
};
SettingModule = tslib_1.__decorate([
    common_1.Module({
        imports: [],
        controllers: [setting_controller_1.SettingController],
        providers: [setting_service_1.SettingService],
        exports: [setting_service_1.SettingService],
    })
], SettingModule);
exports.SettingModule = SettingModule;
//# sourceMappingURL=setting.module.js.map