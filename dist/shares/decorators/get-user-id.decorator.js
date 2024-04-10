"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserID = void 0;
const common_1 = require("@nestjs/common");
const jwt_decode_1 = require("jwt-decode");
const jwt_payload_1 = require("../../modules/auth/strategies/jwt.payload");
const exceptions_1 = require("../exceptions");
exports.UserID = common_1.createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    try {
        const token = request.headers.authorization;
        const payload = jwt_decode_1.default(token);
        return payload.sub;
    }
    catch (e) {
        console.log({ accessTokenError: e });
        throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.BAD_REQUEST);
    }
});
//# sourceMappingURL=get-user-id.decorator.js.map