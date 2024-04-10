"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth.constants");
const users_service_1 = require("../../user/users.service");
const exceptions_1 = require("../../../shares/exceptions");
const authHelper_1 = require("../../../shares/helpers/authHelper");
let PrivateGuard = class PrivateGuard {
    constructor(userService) {
        this.userService = userService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const [key, signature, timestamp] = [
            request.headers[auth_constants_1.SotaDexHeader.APIKEY],
            request.headers[auth_constants_1.SotaDexHeader.SIGNATURE],
            request.headers[auth_constants_1.SotaDexHeader.TIMESTAMP],
        ];
        if (!key || !signature || !timestamp) {
            return false;
        }
        const currentTimestamp = Math.floor(new Date().getTime());
        if (!(currentTimestamp - timestamp >= -10000 && currentTimestamp - timestamp <= 30000)) {
            throw new common_1.HttpException(exceptions_1.httpErrors.APIKEY_TIMESTAMP_TOO_OLD, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.getUserByApiKey(key);
        request.userId = user.id;
        const message = authHelper_1.serializeMessage({
            timestamp,
            method: request.method.toUpperCase(),
            url: request.url,
            data: request.body,
            query: request.params,
        });
    }
};
PrivateGuard = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [users_service_1.UserService])
], PrivateGuard);
exports.PrivateGuard = PrivateGuard;
//# sourceMappingURL=private.guard.js.map