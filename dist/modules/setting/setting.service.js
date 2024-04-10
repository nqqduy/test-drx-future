"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const setting_entity_1 = require("../../models/entities/setting.entity");
const setting_repository_1 = require("../../models/repositories/setting.repository");
const exceptions_1 = require("../../shares/exceptions");
let SettingService = class SettingService {
    constructor(settingRepoReport, settingRepoMaster) {
        this.settingRepoReport = settingRepoReport;
        this.settingRepoMaster = settingRepoMaster;
    }
    async findAll() {
        const settings = await this.settingRepoReport.find();
        return settings;
    }
    async findBySettingKey(key) {
        const setting = await this.settingRepoReport.findOne({
            where: {
                key: key,
            },
        });
        if (setting)
            return setting;
        else
            throw new common_1.HttpException(exceptions_1.httpErrors.SETTING_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
    }
    async updateSettingByKey(key, value) {
        const setting = await this.settingRepoReport.findOne({
            where: {
                key: key,
            },
        });
        if (setting) {
            setting.value = value;
            await this.settingRepoMaster.save(setting);
            return setting;
        }
        else {
            const newSetting = new setting_entity_1.SettingEntity();
            newSetting.key = key;
            newSetting.value = value;
            return newSetting;
        }
    }
};
SettingService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(setting_repository_1.SettingRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(setting_repository_1.SettingRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [setting_repository_1.SettingRepository,
        setting_repository_1.SettingRepository])
], SettingService);
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map