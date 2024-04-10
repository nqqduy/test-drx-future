"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAndSuperAdmin = exports.OnlySuperAdmin = exports.OnlyAdmin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_enum_1 = require("../enums/user.enum");
const exceptions_1 = require("../exceptions");
let OnlyAdmin = class OnlyAdmin {
    canActivate(context) {
        var _a, _b;
        const role = (_b = (_a = context.switchToHttp().getRequest()) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role == user_enum_1.UserRole.ADMIN)
            return true;
        else
            throw new common_1.HttpException(exceptions_1.httpErrors.FORBIDDEN, common_1.HttpStatus.FORBIDDEN);
    }
};
OnlyAdmin = tslib_1.__decorate([
    common_1.Injectable()
], OnlyAdmin);
exports.OnlyAdmin = OnlyAdmin;
let OnlySuperAdmin = class OnlySuperAdmin {
    canActivate(context) {
        var _a, _b;
        const role = (_b = (_a = context.switchToHttp().getRequest()) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role == user_enum_1.UserRole.SUPER_ADMIN)
            return true;
        else
            throw new common_1.HttpException(exceptions_1.httpErrors.FORBIDDEN, common_1.HttpStatus.FORBIDDEN);
    }
};
OnlySuperAdmin = tslib_1.__decorate([
    common_1.Injectable()
], OnlySuperAdmin);
exports.OnlySuperAdmin = OnlySuperAdmin;
let AdminAndSuperAdmin = class AdminAndSuperAdmin {
    canActivate(context) {
        var _a, _b;
        const role = (_b = (_a = context.switchToHttp().getRequest()) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role == user_enum_1.UserRole.ADMIN || role == user_enum_1.UserRole.SUPER_ADMIN)
            return true;
        else
            throw new common_1.HttpException(exceptions_1.httpErrors.FORBIDDEN, common_1.HttpStatus.FORBIDDEN);
    }
};
AdminAndSuperAdmin = tslib_1.__decorate([
    common_1.Injectable()
], AdminAndSuperAdmin);
exports.AdminAndSuperAdmin = AdminAndSuperAdmin;
//# sourceMappingURL=roles.decorator.js.map