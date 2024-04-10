"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingRepository = void 0;
const tslib_1 = require("tslib");
const user_setting_entity_1 = require("../entities/user-setting.entity");
const setting_enum_1 = require("../../shares/enums/setting.enum");
const typeorm_1 = require("typeorm");
let UserSettingRepository = class UserSettingRepository extends typeorm_1.Repository {
    async getUserSettingToSendFundingFeeMail() {
        return this.createQueryBuilder('user_settings')
            .select('*')
            .innerJoin('users', 'users', 'users.id = user_settings.userId')
            .where('user_settings.key =:key', { key: setting_enum_1.NOTIFICATION_KEY.NOTIFICATION })
            .getRawMany();
    }
};
UserSettingRepository.FAVORITE_MARKET = 'FAVORITE_MARKET';
UserSettingRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(user_setting_entity_1.UserSettingEntity)
], UserSettingRepository);
exports.UserSettingRepository = UserSettingRepository;
//# sourceMappingURL=user-setting.repository.js.map