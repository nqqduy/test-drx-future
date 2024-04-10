"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const assets_console_1 = require("./assets.console");
const assets_controller_1 = require("./assets.controller");
const assets_service_1 = require("./assets.service");
let AssetsModule = class AssetsModule {
};
AssetsModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
        ],
        providers: [assets_service_1.AssetsService, assets_console_1.default],
        controllers: [assets_controller_1.AssetsController],
        exports: [assets_service_1.AssetsService],
    })
], AssetsModule);
exports.AssetsModule = AssetsModule;
//# sourceMappingURL=assets.module.js.map