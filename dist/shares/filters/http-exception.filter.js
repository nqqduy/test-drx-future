"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const _a = exception.getResponse(), { code, message } = _a, rest = tslib_1.__rest(_a, ["code", "message"]);
        console.log(`exception.getResponse()`, exception.getResponse());
        response.status(status).json({
            code: code || 'SOTADEX_00000',
            statusCode: status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            info: Object.assign({ message: message || 'Unknown errors' }, rest),
            path: request.url,
        });
    }
};
HttpExceptionFilter = tslib_1.__decorate([
    common_1.Catch(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map