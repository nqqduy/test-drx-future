"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const auth_constants_1 = require("./auth.constants");
const refresh_access_token_dto_1 = require("./dto/refresh-access-token.dto");
const response_login_dto_1 = require("./dto/response-login.dto");
const jwt_payload_1 = require("./strategies/jwt.payload");
const users_service_1 = require("../user/users.service");
const exceptions_1 = require("../../shares/exceptions");
const uuid_1 = require("uuid");
const Web3 = require('web3');
let AuthService = class AuthService {
    constructor(userService, cacheManager, jwtService) {
        this.userService = userService;
        this.cacheManager = cacheManager;
        this.jwtService = jwtService;
        this.web3 = new Web3();
    }
    async refreshAccessToken(refreshAccessTokenDto) {
        const { refreshToken, accessToken } = refreshAccessTokenDto;
        const oldHashAccessToken = await this.cacheManager.get(`${auth_constants_1.AUTH_CACHE_PREFIX}${refreshToken}`);
        if (!oldHashAccessToken)
            throw new common_1.HttpException(exceptions_1.httpErrors.REFRESH_TOKEN_EXPIRED, common_1.HttpStatus.BAD_REQUEST);
        const hashAccessToken = crypto_1.createHash('sha256').update(accessToken).digest('hex');
        if (hashAccessToken == oldHashAccessToken) {
            const keyPair = this.web3.eth.accounts.create();
            const key = keyPair.address.toLowerCase();
            const secret = keyPair.privateKey;
            const oldPayload = await this.decodeAccessToken(accessToken);
            oldPayload.key = key;
            delete oldPayload.iat;
            delete oldPayload.exp;
            const newAccessToken = this.generateAccessToken(oldPayload);
            const newRefreshToken = await this.generateRefreshToken(newAccessToken.accessToken);
            await this.cacheManager.del(`${auth_constants_1.AUTH_CACHE_PREFIX}${refreshToken}`);
            return Object.assign(Object.assign({ secret }, newAccessToken), newRefreshToken);
        }
        else
            throw new common_1.HttpException(exceptions_1.httpErrors.REFRESH_TOKEN_EXPIRED, common_1.HttpStatus.BAD_REQUEST);
    }
    generateAccessToken(payload) {
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async generateRefreshToken(accessToken) {
        const refreshToken = uuid_1.v4();
        const hashedAccessToken = crypto_1.createHash('sha256').update(accessToken).digest('hex');
        await this.cacheManager.set(`${auth_constants_1.AUTH_CACHE_PREFIX}${refreshToken}`, hashedAccessToken, {
            ttl: auth_constants_1.jwtConstants.refreshTokenExpiry,
        });
        return {
            refreshToken: refreshToken,
        };
    }
    async verifyAccessToken(accessToken) {
        return this.jwtService.verifyAsync(accessToken);
    }
    async decodeAccessToken(accessToken) {
        return this.jwtService.decode(accessToken);
    }
    async listApiKey(address) {
        return this.userService.listApiKey(address);
    }
    async createApiKey(address) {
        return this.userService.createApiKey(address);
    }
    async deleteApiKey(apiKey) {
        return this.userService.deleteApiKey(apiKey);
    }
};
AuthService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(1, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [users_service_1.UserService, Object, jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map