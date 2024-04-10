"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyUserID = void 0;
const common_1 = require("@nestjs/common");
exports.ApiKeyUserID = common_1.createParamDecorator((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId;
});
//# sourceMappingURL=api-key-user-id.decorator.js.map