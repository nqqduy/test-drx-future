"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMarginModeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const update_user_margin_mode_dto_1 = require("./dto/update-user-margin-mode.dto");
const user_margin_mode_service_1 = require("./user-margin-mode.service");
let UserMarginModeController = class UserMarginModeController {
    constructor(userMarginModeService) {
        this.userMarginModeService = userMarginModeService;
    }
    async updateMarginMode(input, userId) {
        return {
            data: await this.userMarginModeService.updateMarginMode(userId, input),
        };
    }
    async getMarginMode(userId, instrumentId) {
        return {
            data: await this.userMarginModeService.getMarginMode(userId, instrumentId),
        };
    }
};
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_user_margin_mode_dto_1.UpdateMarginModeDto, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserMarginModeController.prototype, "updateMarginMode", null);
tslib_1.__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()), tslib_1.__param(1, common_1.Query('instrumentId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserMarginModeController.prototype, "getMarginMode", null);
UserMarginModeController = tslib_1.__decorate([
    common_1.Controller('marginMode'),
    swagger_1.ApiTags('marginMode'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [user_margin_mode_service_1.UserMarginModeService])
], UserMarginModeController);
exports.UserMarginModeController = UserMarginModeController;
//# sourceMappingURL=user-margin-mode.controller.js.map