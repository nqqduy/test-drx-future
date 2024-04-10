"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const access_tokens_entity_1 = require("../../models/entities/access-tokens.entity");
const access_token_repository_1 = require("../../models/repositories/access-token.repository");
const exceptions_1 = require("../../shares/exceptions");
let AccessTokenService = class AccessTokenService {
    constructor(accessTokenRepoReport, accessTokenRepoMaster) {
        this.accessTokenRepoReport = accessTokenRepoReport;
        this.accessTokenRepoMaster = accessTokenRepoMaster;
    }
    async addAccessToken(token, userId) {
        const isExist = await this.accessTokenRepoMaster.findOne({
            where: { token },
        });
        if (isExist) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCESS_TOKEN_EXIST, common_1.HttpStatus.FOUND);
        }
        const accessToken = await this.accessTokenRepoMaster.save({
            userId,
            token,
        });
        return accessToken;
    }
    async removeAccessToken(token, userId) {
        const isExist = await this.accessTokenRepoMaster.findOne({
            where: { token, userId },
        });
        if (!isExist) {
            throw new common_1.HttpException(exceptions_1.httpErrors.ACCESS_TOKEN_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        await this.accessTokenRepoMaster.remove(isExist);
        return { message: 'Remove access token success' };
    }
    async revokeAllTokens(userId) {
        await this.accessTokenRepoMaster.update({ userId }, { revoked: true });
        return { message: 'Remove all access token success' };
    }
};
AccessTokenService.DEFAULT_7DAY_MS = 7 * 24 * 60 * 60 * 1000;
AccessTokenService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(access_token_repository_1.AccessTokenRepository, 'report')),
    tslib_1.__param(1, typeorm_1.InjectRepository(access_token_repository_1.AccessTokenRepository, 'master')),
    tslib_1.__metadata("design:paramtypes", [access_token_repository_1.AccessTokenRepository,
        access_token_repository_1.AccessTokenRepository])
], AccessTokenService);
exports.AccessTokenService = AccessTokenService;
//# sourceMappingURL=access-token.service.js.map