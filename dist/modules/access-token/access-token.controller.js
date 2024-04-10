"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_tokens_entity_1 = require("../../models/entities/access-tokens.entity");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const response_dto_1 = require("../../shares/dtos/response.dto");
const jwt_token_guard_1 = require("../auth/guards/jwt-token.guard");
const access_token_service_1 = require("./access-token.service");
const add_token_dto_1 = require("./dto/add-token.dto");
let AccessTokenController = class AccessTokenController {
    constructor(accessTokenService) {
        this.accessTokenService = accessTokenService;
    }
    async addAccessToken(body, userId) {
        return {
            data: await this.accessTokenService.addAccessToken(body.token, userId),
        };
    }
    async removeAccessToken(body, userId) {
        return {
            data: await this.accessTokenService.removeAccessToken(body.token, userId),
        };
    }
    async revokeAllTokens(userId) {
        return {
            data: await this.accessTokenService.revokeAllTokens(userId),
        };
    }
};
tslib_1.__decorate([
    common_1.Post('/v1'),
    common_1.UseGuards(jwt_token_guard_1.JwtTokenGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [add_token_dto_1.AccessTokenDto, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AccessTokenController.prototype, "addAccessToken", null);
tslib_1.__decorate([
    common_1.Delete('/'),
    common_1.UseGuards(jwt_token_guard_1.JwtTokenGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [add_token_dto_1.AccessTokenDto, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AccessTokenController.prototype, "removeAccessToken", null);
tslib_1.__decorate([
    common_1.Put('/revoke-tokens'),
    common_1.UseGuards(jwt_token_guard_1.JwtTokenGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AccessTokenController.prototype, "revokeAllTokens", null);
AccessTokenController = tslib_1.__decorate([
    common_1.Controller('access-token'),
    swagger_1.ApiTags('Access-token'),
    swagger_1.ApiBearerAuth(),
    tslib_1.__metadata("design:paramtypes", [access_token_service_1.AccessTokenService])
], AccessTokenController);
exports.AccessTokenController = AccessTokenController;
//# sourceMappingURL=access-token.controller.js.map