"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdminGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const access_token_repository_1 = require("../../../models/repositories/access-token.repository");
const exceptions_1 = require("../../../shares/exceptions");
const typeorm_2 = require("typeorm");
const node_fetch_1 = require("node-fetch");
let JwtAdminGuard = class JwtAdminGuard extends passport_1.AuthGuard('jwt') {
    constructor(connection) {
        super();
        this.connection = connection;
        this.accessTokenRepository = this.connection.getCustomRepository(access_token_repository_1.AccessTokenRepository);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const bearerHeader = request.headers.authorization;
        if (!bearerHeader) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        const checkAdminToken = await node_fetch_1.default(`${process.env.SPOT_URL_API}/admin/auth`, {
            method: 'post',
            headers: {
                Authorization: bearerHeader,
            },
        });
        console.log('=====================================================');
        console.log(checkAdminToken);
        if (checkAdminToken.status != 200) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
};
JwtAdminGuard = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectConnection('report')),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Connection])
], JwtAdminGuard);
exports.JwtAdminGuard = JwtAdminGuard;
//# sourceMappingURL=jwt.admin.guard.js.map