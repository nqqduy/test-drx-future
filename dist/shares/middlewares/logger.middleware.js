"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const morgan = require("morgan");
const configs_1 = require("../../configs");
const env = configs_1.getConfig().get('app.node_env');
function jsonFormat(_tokens, req, res) {
    const logInfo = {
        req: {
            url: req.url,
            method: req.method,
            body: req.body,
            query: req.query,
            params: req.params,
        },
        res: {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
        },
    };
    return JSON.stringify(logInfo);
}
let LoggerMiddleware = class LoggerMiddleware {
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext('LoggerMiddleware');
    }
    use(req, res, next) {
        return morgan(jsonFormat, {
            stream: {
                write: (_logInfo) => {
                    const logInfo = JSON.parse(_logInfo);
                    if (env != 'develop') {
                        console.log(logInfo);
                    }
                },
            },
        })(req, res, next);
    }
};
LoggerMiddleware = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger])
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map