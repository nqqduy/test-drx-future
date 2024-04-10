"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let SentryInterceptor = class SentryInterceptor {
    intercept(context, next) {
        return next.handle().pipe(operators_1.catchError((err) => {
            console.log(err);
            if (err instanceof common_1.HttpException) {
                return rxjs_1.throwError(err);
            }
            Sentry.captureException(err);
            return rxjs_1.throwError(new common_1.InternalServerErrorException(`Sorry, we're having temporary server issues`));
        }));
    }
};
SentryInterceptor = tslib_1.__decorate([
    common_1.Injectable()
], SentryInterceptor);
exports.SentryInterceptor = SentryInterceptor;
//# sourceMappingURL=sentry.interceptor.js.map