"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_setting_entity_1 = require("../../models/entities/user-setting.entity");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const response_dto_1 = require("../../shares/dtos/response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_setting_dto_1 = require("./dto/user-setting-dto");
const user_setting_service_1 = require("./user-setting.service");
let UserSettingController = class UserSettingController {
    constructor(userSettingService) {
        this.userSettingService = userSettingService;
    }
    async updateUserPreferenceSetting(body, userId) {
        return {
            data: await this.userSettingService.updateUserSettingByKey(user_setting_entity_1.UserSettingEntity.NOTIFICATION, body, userId),
        };
    }
    async getUserPreferenceSetting(userId) {
        const userSetting = await this.userSettingService.getUserSettingByKey(user_setting_entity_1.UserSettingEntity.NOTIFICATION, userId);
        return {
            data: userSetting,
        };
    }
};
tslib_1.__decorate([
    common_1.Post('preference'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_setting_dto_1.UpdateNotificationSettingDto, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserSettingController.prototype, "updateUserPreferenceSetting", null);
tslib_1.__decorate([
    common_1.Get('preference'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserSettingController.prototype, "getUserPreferenceSetting", null);
UserSettingController = tslib_1.__decorate([
    common_1.Controller('user-setting'),
    swagger_1.ApiTags('User Setting'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [user_setting_service_1.UserSettingeService])
], UserSettingController);
exports.UserSettingController = UserSettingController;
//# sourceMappingURL=user-setting.controller.js.map