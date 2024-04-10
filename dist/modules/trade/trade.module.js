"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const account_module_1 = require("../account/account.module");
const trade_controller_1 = require("./trade.controller");
const trade_service_1 = require("./trade.service");
const trade_console_1 = require("./trade.console");
let TradeModule = class TradeModule {
};
TradeModule = tslib_1.__decorate([
    common_1.Module({
        imports: [account_module_1.AccountsModule],
        controllers: [trade_controller_1.TradeController],
        providers: [trade_service_1.TradeService, trade_console_1.default],
        exports: [trade_service_1.TradeService],
    })
], TradeModule);
exports.TradeModule = TradeModule;
//# sourceMappingURL=trade.module.js.map