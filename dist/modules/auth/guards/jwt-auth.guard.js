"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const access_token_repository_1 = require("../../../models/repositories/access-token.repository");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const exceptions_1 = require("../../../shares/exceptions");
const nestjs_redis_1 = require("nestjs-redis");
const node_fetch_1 = require("node-fetch");
const auth_constants_1 = require("../auth.constants");
const crypto = require('crypto');
let JwtAuthGuard = class JwtAuthGuard extends passport_1.AuthGuard('jwt') {
    constructor(connection, redisService) {
        super();
        this.connection = connection;
        this.redisService = redisService;
        this.accessTokenRepository = this.connection.getCustomRepository(access_token_repository_1.AccessTokenRepository);
    }
    async canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers.apikey;
        if (apiKey) {
            let data;
            const timestamp = parseFloat(request.headers.timestamp);
            const checkTimestamp = Date.now() / 1000 - timestamp;
            if (checkTimestamp > auth_constants_1.EXPIRED) {
                throw new common_1.HttpException(exceptions_1.httpErrors.TIMESTAMP_EXPIRED, common_1.HttpStatus.BAD_REQUEST);
            }
            const signature = request.headers.signature;
            if (auth_constants_1.API_METHOD.includes(request.method)) {
                data = request === null || request === void 0 ? void 0 : request.body;
            }
            else {
                data = request === null || request === void 0 ? void 0 : request.query;
            }
            const dataEncrypt = Object.assign(Object.assign({}, data), { timestamp });
            this.handleEncrypt(dataEncrypt, signature);
            const checkApiKey = await node_fetch_1.default(`${process.env.SPOT_URL_API}/check-api-key`, {
                method: 'GET',
                headers: {
                    APIKEY: apiKey,
                },
            });
            const resApikey = await (checkApiKey === null || checkApiKey === void 0 ? void 0 : checkApiKey.json());
            const decodedApiKey = this.decodeAPIKEY(apiKey);
            const apiKeyPermissionInRedis = await this.redisService
                .getClient()
                .get(`laravel:${resApikey === null || resApikey === void 0 ? void 0 : resApikey.scopes}_${decodedApiKey}`);
            let permission;
            if (apiKeyPermissionInRedis) {
                permission = apiKeyPermissionInRedis;
            }
            else {
                permission = resApikey.scopes;
            }
            this.checkPermissionRead(permission, request);
            const apiKeyInRedis = await this.redisService.getClient().get(`laravel:${decodedApiKey}`);
            if (apiKeyInRedis) {
                request.headers.authorization = 'Bearer ' + (apiKeyInRedis === null || apiKeyInRedis === void 0 ? void 0 : apiKeyInRedis.split(`"`)[1]);
            }
            else {
                request.headers.authorization = resApikey.token;
            }
        }
        else {
            const bearerHeader = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!bearerHeader) {
                throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = await super.canActivate(context);
        if (rxjs_1.isObservable(result)) {
            return rxjs_1.firstValueFrom(result);
        }
        else {
            return result;
        }
    }
    checkPermissionRead(permission, request) {
        if (!permission.includes(auth_constants_1.API_KEY_PERMISSION.ID) && auth_constants_1.API_METHOD.includes(request.method)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.NOT_HAVE_ACCESS, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    handleEncrypt(data, signature) {
        const encryptData = this.encryptSHA256(JSON.stringify(data));
        if (encryptData !== signature) {
            throw new common_1.HttpException(exceptions_1.httpErrors.SIGNATURE_IS_NOT_VALID, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    encryptSHA256(input) {
        const hash = crypto.createHash('sha256');
        hash.update(input);
        return hash.digest('hex');
    }
    decodeAPIKEY(apiKey) {
        const encrypt = '6fe17230cd48b9a5';
        const replacements = '0123456789abcdef';
        let decodedKey = '';
        for (let i = 0; i < (apiKey === null || apiKey === void 0 ? void 0 : apiKey.length); i++) {
            const char = apiKey[i];
            const index = encrypt.indexOf(char);
            if (index !== -1) {
                decodedKey += replacements[index];
            }
            else {
                decodedKey += char;
            }
        }
        return decodedKey;
    }
};
JwtAuthGuard = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_2.InjectConnection('master')),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Connection, nestjs_redis_1.RedisService])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt-auth.guard.js.map