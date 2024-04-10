"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config = {};
let HttpClient = class HttpClient {
    constructor() {
        this._initializeResponseInterceptor = () => {
            this.client.interceptors.response.use(this._handleResponse, this._handleError);
        };
        this._handleResponse = (response) => {
            return response.data;
        };
        this._handleError = (error) => {
            return Promise.reject(error);
        };
        this.client = axios_1.default.create(config);
        this._initializeResponseInterceptor();
    }
};
HttpClient = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], HttpClient);
exports.HttpClient = HttpClient;
//# sourceMappingURL=https.client.js.map