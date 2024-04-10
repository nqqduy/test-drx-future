"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bignumber_js_1 = require("bignumber.js");
const setting_entity_1 = require("../../models/entities/setting.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const update_setting_dto_1 = require("./dto/update-setting.dto");
const setting_service_1 = require("./setting.service");
const roles_decorator_1 = require("../../shares/decorators/roles.decorator");
const response_dto_1 = require("../../shares/dtos/response.dto");
const exceptions_1 = require("../../shares/exceptions");
let SettingController = class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async getAll() {
        return {
            data: await this.settingService.findAll(),
        };
    }
    async getMinimumWithdrawal() {
        return {
            data: await this.settingService.findBySettingKey(setting_entity_1.SettingEntity.MINIMUM_WITHDRAWAL),
        };
    }
    async updateMinimumWithdrawal(dto) {
        if (new bignumber_js_1.default(dto.value).lt(0))
            throw new common_1.HttpException(exceptions_1.httpErrors.SETTING_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        return {
            data: await this.settingService.updateSettingByKey(setting_entity_1.SettingEntity.MINIMUM_WITHDRAWAL, dto.value),
        };
    }
    async getWithdrawalFee() {
        return {
            data: await this.settingService.findBySettingKey(setting_entity_1.SettingEntity.WITHDRAW_FEE),
        };
    }
    async updateWithdrawalFee(dto) {
        if (new bignumber_js_1.default(dto.value).lt(0))
            throw new common_1.HttpException(exceptions_1.httpErrors.SETTING_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        return {
            data: await this.settingService.updateSettingByKey(setting_entity_1.SettingEntity.WITHDRAW_FEE, dto.value),
        };
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SettingController.prototype, "getAll", null);
tslib_1.__decorate([
    common_1.Get('minimum-withdrawal'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SettingController.prototype, "getMinimumWithdrawal", null);
tslib_1.__decorate([
    common_1.Post('minimum-withdrawal'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_decorator_1.AdminAndSuperAdmin),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_setting_dto_1.UpdateSettingDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingController.prototype, "updateMinimumWithdrawal", null);
tslib_1.__decorate([
    common_1.Get('withdrawal-fee'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SettingController.prototype, "getWithdrawalFee", null);
tslib_1.__decorate([
    common_1.Post('withdrawal-fee'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_decorator_1.AdminAndSuperAdmin),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_setting_dto_1.UpdateSettingDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SettingController.prototype, "updateWithdrawalFee", null);
SettingController = tslib_1.__decorate([
    common_1.Controller('setting'),
    swagger_1.ApiTags('Setting'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [setting_service_1.SettingService])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map