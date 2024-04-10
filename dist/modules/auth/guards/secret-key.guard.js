"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtSecretGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config = require("config");
const exceptions_1 = require("../../../shares/exceptions");
let JwtSecretGuard = class JwtSecretGuard {
    constructor() { }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const bearerHeader = request.headers.authorization.split(' ')[1];
        console.log(config.get('secret.key'));
        if (!bearerHeader) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        if (bearerHeader !== config.get('secret.key')) {
            throw new common_1.HttpException(exceptions_1.httpErrors.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
};
JwtSecretGuard = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], JwtSecretGuard);
exports.JwtSecretGuard = JwtSecretGuard;
//# sourceMappingURL=secret-key.guard.js.map