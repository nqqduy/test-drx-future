"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallApi = void 0;
async function CallApi(url, query, method, header) {
    return await fetch(url, {
        method: method,
        headers: Object.assign({ 'Content-Type': 'application/json', Accept: 'application/json' }, header),
        body: JSON.stringify(query),
    });
}
exports.CallApi = CallApi;
//# sourceMappingURL=call-api.helper.js.map