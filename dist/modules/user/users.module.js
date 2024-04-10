"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const jwt_1 = require("@nestjs/jwt");
const auth_constants_1 = require("../auth/auth.constants");
const mail_module_1 = require("../mail/mail.module");
let UsersModule = class UsersModule {
};
UsersModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.Logger,
            jwt_1.JwtModule.register({
                secret: auth_constants_1.jwtConstants.accessTokenSecret,
                signOptions: { expiresIn: auth_constants_1.jwtConstants.accessTokenExpiry },
            }),
            mail_module_1.MailModule,
        ],
        providers: [users_service_1.UserService, common_1.Logger],
        exports: [users_service_1.UserService],
        controllers: [users_controller_1.UserController],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map