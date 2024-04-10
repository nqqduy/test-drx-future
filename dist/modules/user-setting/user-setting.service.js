"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_setting_entity_1 = require("../../models/entities/user-setting.entity");
const user_setting_repository_1 = require("../../models/repositories/user-setting.repository");
const exceptions_1 = require("../../shares/exceptions");
const moment = require("moment");
const setting_enum_1 = require("../../shares/enums/setting.enum");
const account_repository_1 = require("../../models/repositories/account.repository");
const user_repository_1 = require("../../models/repositories/user.repository");
moment().format();
let UserSettingeService = class UserSettingeService {
    constructor(userSettingRepoReport, userSettingMasterReport, accountRepoReport, userRepoReport, logger) {
        this.userSettingRepoReport = userSettingRepoReport;
        this.userSettingMasterReport = userSettingMasterReport;
        this.accountRepoReport = accountRepoReport;
        this.userRepoReport = userRepoReport;
        this.logger = logger;
    }
    async updateUserSettingByKey(key, body, userId) {
        const { limitOrder, marketOrder, stopLimitOrder, stopMarketOrder, traillingStopOrder, takeProfitTrigger, stopLossTrigger, fundingFeeTriggerValue, fundingFeeTrigger, } = body;
        const setting = await this.userSettingRepoReport.findOne({
            where: {
                key: key,
                userId,
            },
        });
        let newSetting;
        if (setting) {
            newSetting = await this.userSettingMasterReport.update({ userId: setting.userId, key: setting.key }, Object.assign({}, body));
        }
        else {
            newSetting = new user_setting_entity_1.UserSettingEntity();
            newSetting.key = key;
            newSetting.limitOrder = limitOrder;
            newSetting.marketOrder = marketOrder;
            newSetting.stopLimitOrder = stopLimitOrder;
            newSetting.stopMarketOrder = stopMarketOrder;
            newSetting.traillingStopOrder = traillingStopOrder;
            newSetting.takeProfitTrigger = takeProfitTrigger;
            newSetting.stopLossTrigger = stopLossTrigger;
            newSetting.fundingFeeTriggerValue = fundingFeeTriggerValue;
            newSetting.fundingFeeTrigger = fundingFeeTrigger;
            newSetting.userId = userId;
            await this.userSettingMasterReport.insert(newSetting);
        }
        return newSetting;
    }
    async getUserSettingByKey(key, userId) {
        const userSetting = await this.userSettingRepoReport.findOne({
            where: {
                key: key,
                userId,
            },
        });
        if (userSetting) {
            return userSetting;
        }
        else {
            const newSetting = new user_setting_entity_1.UserSettingEntity();
            newSetting.key = key;
            newSetting.limitOrder = false;
            newSetting.marketOrder = false;
            newSetting.stopLimitOrder = false;
            newSetting.stopMarketOrder = false;
            newSetting.traillingStopOrder = false;
            newSetting.takeProfitTrigger = false;
            newSetting.stopLossTrigger = false;
            newSetting.fundingFeeTriggerValue = 0.25;
            newSetting.fundingFeeTrigger = false;
            newSetting.userId = userId;
            await this.userSettingMasterReport.insert(newSetting);
            return newSetting;
        }
    }
    async updateNotificationSetting(key, userId) {
        const now = new Date().getTime();
        const userSetting = await this.userSettingRepoReport.findOne({
            where: {
                key: key,
                userId,
            },
        });
        if (!userSetting) {
            throw new common_1.HttpException(exceptions_1.httpErrors.USER_SETTING_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        const endTime = moment().utc().endOf('day').toDate().getTime();
        const startTime = userSetting.time.getTime();
        if (now <= endTime && userSetting.notificationQuantity === setting_enum_1.TP_SL_NOTIFICATION.QUANTITY) {
            throw new common_1.HttpException(exceptions_1.httpErrors.USER_SETTING_TP_SL_NOTIFICATION, common_1.HttpStatus.BAD_REQUEST);
        }
        if (now >= startTime && now <= endTime) {
            userSetting.notificationQuantity = userSetting.notificationQuantity + 1;
            await this.userSettingMasterReport.save(userSetting);
        }
        if (now > endTime) {
            userSetting.notificationQuantity = 0;
            await this.userSettingMasterReport.save(userSetting);
        }
        return;
    }
    async getUserSettingByUserId(userId) {
        try {
            const user = await this.userRepoReport.findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                return {};
            }
            const userNotificationSettings = await this.userSettingRepoReport.findOne({
                key: setting_enum_1.NOTIFICATION_KEY.NOTIFICATION,
                userId: userId,
            });
            if (!userNotificationSettings) {
                return {};
            }
            return { userNotificationSettings, user };
        }
        catch (error) {
            this.logger.error(`Failed to find setting at error: ${error}`);
        }
    }
};
UserSettingeService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(user_setting_repository_1.UserSettingRepository, 'master')),
    tslib_1.__param(2, typeorm_1.InjectRepository(account_repository_1.AccountRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(user_repository_1.UserRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [user_setting_repository_1.UserSettingRepository,
        user_setting_repository_1.UserSettingRepository,
        account_repository_1.AccountRepository,
        user_repository_1.UserRepository,
        common_1.Logger])
], UserSettingeService);
exports.UserSettingeService = UserSettingeService;
//# sourceMappingURL=user-setting.service.js.map