"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const response_dto_1 = require("../../shares/dtos/response.dto");
const response_login_dto_1 = require("./dto/response-login.dto");
const refresh_access_token_dto_1 = require("./dto/refresh-access-token.dto");
const user_entity_1 = require("../../models/entities/user.entity");
const users_service_1 = require("../user/users.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const private_guard_1 = require("./guards/private.guard");
const api_key_user_id_decorator_1 = require("../../shares/decorators/api-key-user-id.decorator");
const mail_service_1 = require("../mail/mail.service");
let AuthController = class AuthController {
    constructor(authService, userService, mailService) {
        this.authService = authService;
        this.userService = userService;
        this.mailService = mailService;
    }
    async currentUser(userId) {
        const user = await this.userService.findUserById(userId);
        const pendingEmail = await this.mailService.getPendingEmail(user);
        return {
            data: Object.assign(Object.assign({}, user), { pendingEmail }),
        };
    }
    async refreshAccessToken(refreshAccessTokenDto) {
        return {
            data: await this.authService.refreshAccessToken(refreshAccessTokenDto),
        };
    }
    async me(userId) {
        return {
            data: await this.userService.findUserById(userId),
        };
    }
};
tslib_1.__decorate([
    common_1.Get('/current'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "currentUser", null);
tslib_1.__decorate([
    common_1.Post('refresh-access-token'),
    swagger_1.ApiBody({
        type: refresh_access_token_dto_1.RefreshAccessTokenDto,
    }),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [refresh_access_token_dto_1.RefreshAccessTokenDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAccessToken", null);
tslib_1.__decorate([
    common_1.Get('/me'),
    common_1.UseGuards(private_guard_1.PrivateGuard),
    tslib_1.__param(0, api_key_user_id_decorator_1.ApiKeyUserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
AuthController = tslib_1.__decorate([
    common_1.Controller('auth'),
    swagger_1.ApiTags('Auth'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UserService,
        mail_service_1.MailService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map