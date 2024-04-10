"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redisStore = require("cache-manager-redis-store");
const redis_config_1 = require("../../configs/redis.config");
const account_console_1 = require("./account.console");
const account_controller_1 = require("./account.controller");
const account_service_1 = require("./account.service");
const latest_block_module_1 = require("../latest-block/latest-block.module");
const users_module_1 = require("../user/users.module");
const orderbook_module_1 = require("../orderbook/orderbook.module");
let AccountsModule = class AccountsModule {
};
AccountsModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            common_1.CacheModule.register(Object.assign(Object.assign({ store: redisStore }, redis_config_1.redisConfig), { isGlobal: true })),
            latest_block_module_1.LatestBlockModule,
            users_module_1.UsersModule,
            orderbook_module_1.OrderbookModule,
        ],
        providers: [account_service_1.AccountService, account_console_1.AccountConsole, common_1.Logger],
        controllers: [account_controller_1.AccountController],
        exports: [account_service_1.AccountService],
    })
], AccountsModule);
exports.AccountsModule = AccountsModule;
//# sourceMappingURL=account.module.js.map