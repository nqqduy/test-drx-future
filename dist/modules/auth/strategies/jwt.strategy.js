"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const tslib_1 = require("tslib");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../user/users.service");
const exceptions_1 = require("../../../shares/exceptions");
const user_enum_1 = require("../../../shares/enums/user.enum");
const jwt_payload_1 = require("./jwt.payload");
const user_entity_1 = require("../../../models/entities/user.entity");
const config = require("config");
let JwtStrategy = class JwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy) {
    constructor(userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(config.get('jwt_key.public').toString(), 'base64').toString('ascii'),
            algorithms: ['RS256'],
        });
        this.userService = userService;
    }
    async validate(payload) {
        const user = await this.userService.findUserById(+payload.sub);
        if (!user) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (user.isLocked == user_enum_1.UserIsLocked.LOCKED) {
            throw new common_1.HttpException(exceptions_1.httpErrors.LOCKED_USER, common_1.HttpStatus.FORBIDDEN);
        }
        if (user.status === user_enum_1.UserStatus.DEACTIVE) {
            await this.userService.updateStatusUser(user.id, user_enum_1.UserStatus.ACTIVE);
        }
        return user;
    }
};
JwtStrategy = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [users_service_1.UserService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map