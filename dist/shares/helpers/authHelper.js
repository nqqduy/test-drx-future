"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMessage = void 0;
const lodash = require('lodash');
const serializeMessage = (message) => {
    return JSON.stringify(lodash.cloneDeepWith(message, (value) => {
        return !lodash.isPlainObject(value) ? lodash.toString(value) : undefined;
    }));
};
exports.serializeMessage = serializeMessage;
//# sourceMappingURL=authHelper.js.map