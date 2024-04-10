"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redisIoAdapter = require("socket.io-redis");
const redis_config_1 = require("../configs/redis.config");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        const redisAdapter = redisIoAdapter({ host: redis_config_1.redisConfig.host, port: redis_config_1.redisConfig.port });
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis.adapter.js.map