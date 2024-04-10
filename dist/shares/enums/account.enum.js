"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ID_INSURANCE_ACCOUNT = void 0;
const config = require("config");
var USER_ID_INSURANCE_ACCOUNT;
(function (USER_ID_INSURANCE_ACCOUNT) {
    USER_ID_INSURANCE_ACCOUNT[USER_ID_INSURANCE_ACCOUNT["DEFAULT"] = config.get('insurance_account.user_id')] = "DEFAULT";
})(USER_ID_INSURANCE_ACCOUNT = exports.USER_ID_INSURANCE_ACCOUNT || (exports.USER_ID_INSURANCE_ACCOUNT = {}));
//# sourceMappingURL=account.enum.js.map