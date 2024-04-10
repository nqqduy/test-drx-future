"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMailStatus = exports.UserIsLocked = exports.UserType = exports.UserRole = exports.UserStatus = void 0;
const enumize_1 = require("./enumize");
exports.UserStatus = enumize_1.enumize('ACTIVE', 'DEACTIVE');
exports.UserRole = enumize_1.enumize('USER', 'ADMIN', 'SUPER_ADMIN');
exports.UserType = enumize_1.enumize('RESTRICTED', 'UNRESTRICTED');
exports.UserIsLocked = enumize_1.enumize('LOCKED', 'UNLOCKED');
exports.UserMailStatus = enumize_1.enumize('NONE', 'VERIFIED');
//# sourceMappingURL=user.enum.js.map