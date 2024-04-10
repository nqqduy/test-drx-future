"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
const index_1 = require("./index");
exports.redisConfig = {
    host: index_1.getConfig().get('redis.host'),
    port: index_1.getConfig().get('redis.port'),
};
//# sourceMappingURL=redis.config.js.map