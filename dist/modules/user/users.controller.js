"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../models/entities/user.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const mail_service_1 = require("../mail/mail.service");
const favorite_market_dto_1 = require("./dto/favorite-market.dto");
const update_favorite_market_dto_1 = require("./dto/update-favorite-market.dto");
const users_service_1 = require("./users.service");
const get_user_id_decorator_1 = require("../../shares/decorators/get-user-id.decorator");
const response_dto_1 = require("../../shares/dtos/response.dto");
const secret_key_guard_1 = require("../auth/guards/secret-key.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
let UserController = class UserController {
    constructor(userService, mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }
    async insertUser(body) {
        const user = await this.userService.createUser(body);
        return {
            data: user,
        };
    }
    async getFavoriteMarket(userId) {
        const farvoriteMarkets = await this.userService.getUserFavoriteMarket(userId);
        return {
            data: farvoriteMarkets,
        };
    }
    async addFavoriteMarket(userId, updateFavoriteMarketDto) {
        const updateResult = await this.userService.updateUserFavoriteMarket(userId, updateFavoriteMarketDto.symbol, updateFavoriteMarketDto.isFavorite);
        return {
            data: updateResult,
        };
    }
};
tslib_1.__decorate([
    common_1.Post('/'),
    common_1.UseGuards(secret_key_guard_1.JwtSecretGuard),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "insertUser", null);
tslib_1.__decorate([
    common_1.Get('/favorite'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getFavoriteMarket", null);
tslib_1.__decorate([
    common_1.Post('/favorite'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, get_user_id_decorator_1.UserID()),
    tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, update_favorite_market_dto_1.UpdateFavoriteMarketDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "addFavoriteMarket", null);
UserController = tslib_1.__decorate([
    common_1.Controller('user'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiTags('User'),
    tslib_1.__metadata("design:paramtypes", [users_service_1.UserService, mail_service_1.MailService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=users.controller.js.map