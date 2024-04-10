"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const balance_service_1 = require("./balance.service");
const balance_controller_1 = require("./balance.controller");
const order_module_1 = require("../order/order.module");
const position_module_1 = require("../position/position.module");
const account_module_1 = require("../account/account.module");
const index_module_1 = require("../index/index.module");
let BalanceModule = class BalanceModule {
};
BalanceModule = tslib_1.__decorate([
    common_1.Module({
        imports: [order_module_1.OrderModule, position_module_1.PositionModule, account_module_1.AccountsModule, index_module_1.IndexModule],
        providers: [balance_service_1.BalanceService],
        controllers: [balance_controller_1.BalanceController],
        exports: [balance_service_1.BalanceService],
    })
], BalanceModule);
exports.BalanceModule = BalanceModule;
//# sourceMappingURL=balance.module.js.map