"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumize = void 0;
function enumize(...args) {
    const ret = {};
    args.forEach((k) => (ret[k] = k));
    return ret;
}
exports.enumize = enumize;
//# sourceMappingURL=enumize.js.map