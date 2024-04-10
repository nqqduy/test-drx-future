"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const https_client_1 = require("./https.client");
let HttpClientModule = class HttpClientModule {
};
HttpClientModule = tslib_1.__decorate([
    common_1.Global(),
    common_1.Module({
        providers: [https_client_1.HttpClient],
        exports: [https_client_1.HttpClient],
    })
], HttpClientModule);
exports.HttpClientModule = HttpClientModule;
//# sourceMappingURL=http.module.js.map