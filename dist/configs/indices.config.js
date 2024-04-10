"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicesConfig = void 0;
const config = require("config");
const interval = Number(config.get('indices.interval'));
exports.IndicesConfig = {
    interval,
};
//# sourceMappingURL=indices.config.js.map