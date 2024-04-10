"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("../user/users.module");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const auth_controller_1 = require("./auth.controller");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const mail_module_1 = require("../mail/mail.module");
const config = require("config");
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: Buffer.from(config.get('jwt_key.private').toString(), 'base64').toString('ascii'),
                signOptions: {
                    expiresIn: 3600,
                    algorithm: 'RS256',
                },
            }),
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            mail_module_1.MailModule,
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map