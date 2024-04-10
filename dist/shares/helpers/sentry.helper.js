"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryHelper = void 0;
const Sentry = require("@sentry/node");
class SentryHelper {
    static captureException(err) {
        Sentry.captureException(err);
        return true;
    }
}
exports.SentryHelper = SentryHelper;
//# sourceMappingURL=sentry.helper.js.map