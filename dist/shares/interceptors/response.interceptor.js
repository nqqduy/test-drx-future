"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTransformInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const operators_1 = require("rxjs/operators");
const configs_1 = require("../../configs");
let ResponseTransformInterceptor = class ResponseTransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe(operators_1.map((_data) => {
            var _a, _b;
            const data = class_transformer_1.classToPlain(_data);
            const req = context.switchToHttp().getRequest();
            const metadata = Object.assign({}, data.metadata);
            metadata.apiName = configs_1.getConfig().get('app.name');
            metadata.apiVersion = configs_1.getConfig().get('app.prefix');
            metadata.timestamp = new Date();
            if (((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.length) || (data === null || data === void 0 ? void 0 : data.length)) {
                metadata.length = ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.length) || (data === null || data === void 0 ? void 0 : data.length);
            }
            if (req.query) {
                metadata.query = Object.assign({}, req.query);
            }
            delete data.metadata;
            if (req.originalUrl === '/metric') {
                return data.data || data;
            }
            return {
                code: common_1.HttpStatus.OK,
                data: data.data || data,
                metadata: metadata,
            };
        }));
    }
};
ResponseTransformInterceptor = tslib_1.__decorate([
    common_1.Injectable()
], ResponseTransformInterceptor);
exports.ResponseTransformInterceptor = ResponseTransformInterceptor;
//# sourceMappingURL=response.interceptor.js.map