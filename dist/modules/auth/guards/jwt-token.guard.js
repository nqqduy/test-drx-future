"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const access_token_repository_1 = require("../../../models/repositories/access-token.repository");
const exceptions_1 = require("../../../shares/exceptions");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let JwtTokenGuard = class JwtTokenGuard extends passport_1.AuthGuard('jwt') {
    constructor(connection) {
        super();
        this.connection = connection;
        this.accessTokenRepository = this.connection.getCustomRepository(access_token_repository_1.AccessTokenRepository);
    }
    async canActivate(context) {
        const request = await context.switchToHttp().getRequest();
        const bearerHeader = request.headers.authorization.split(' ')[1];
        const body = request.body;
        const futureUser = process.env.FUTURE_USER;
        const futurePassword = process.env.FUTURE_PASSWORD;
        if (futureUser !== body.futureUser || futurePassword !== body.futurePassword) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!bearerHeader) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        else {
            return true;
        }
    }
};
JwtTokenGuard = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectConnection('report')),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Connection])
], JwtTokenGuard);
exports.JwtTokenGuard = JwtTokenGuard;
//# sourceMappingURL=jwt-token.guard.js.map