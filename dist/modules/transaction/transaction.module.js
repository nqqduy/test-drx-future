"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const database_common_1 = require("../../models/database-common");
const account_module_1 = require("../account/account.module");
const latest_block_module_1 = require("../latest-block/latest-block.module");
const transaction_console_1 = require("./transaction.console");
const transaction_service_1 = require("./transaction.service");
const transaction_controller_1 = require("./transaction.controller");
let TransactionModule = class TransactionModule {
};
TransactionModule = tslib_1.__decorate([
    common_1.Module({
        providers: [common_1.Logger, transaction_service_1.TransactionService, transaction_console_1.TransactionConsole],
        controllers: [transaction_controller_1.TransactionController],
        imports: [database_common_1.DatabaseCommonModule, account_module_1.AccountsModule, latest_block_module_1.LatestBlockModule],
        exports: [transaction_service_1.TransactionService],
    })
], TransactionModule);
exports.TransactionModule = TransactionModule;
//# sourceMappingURL=transaction.module.js.map