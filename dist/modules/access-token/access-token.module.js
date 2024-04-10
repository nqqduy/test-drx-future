"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const access_token_controller_1 = require("./access-token.controller");
const access_token_service_1 = require("./access-token.service");
let AccessTokenModule = class AccessTokenModule {
};
AccessTokenModule = tslib_1.__decorate([
    common_1.Module({
        providers: [access_token_service_1.AccessTokenService],
        controllers: [access_token_controller_1.AccessTokenController],
    })
], AccessTokenModule);
exports.AccessTokenModule = AccessTokenModule;
//# sourceMappingURL=access-token.module.js.map