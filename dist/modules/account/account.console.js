"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const account_service_1 = require("./account.service");
let AccountConsole = class AccountConsole {
    constructor(logger, accountService) {
        this.logger = logger;
        this.accountService = accountService;
    }
    async saveDailyBalance() {
        await this.accountService.saveUserDailyBalance();
    }
    async genInsuranceAccount() {
        await this.accountService.genInsuranceAccounts();
    }
    async genNewAssetAccount(asset) {
        await this.accountService.genNewAssetAccounts(asset);
    }
    async syncEmail() {
        await this.accountService.syncEmail();
    }
    async depositBot() {
        await this.accountService.depositUSDTBotAccount();
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'account:daily-balance',
        description: 'Saving current account balance to account history',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AccountConsole.prototype, "saveDailyBalance", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'account:gen-insurance-account',
        description: 'Saving current account balance to account history',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AccountConsole.prototype, "genInsuranceAccount", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'account:gen-account <asset>',
        description: 'Gen new asset account',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountConsole.prototype, "genNewAssetAccount", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'account:sync-email',
        description: 'sync email account',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AccountConsole.prototype, "syncEmail", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'account:deposit-usdt-bot',
        description: 'deposit usdt to bot account',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AccountConsole.prototype, "depositBot", null);
AccountConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger, account_service_1.AccountService])
], AccountConsole);
exports.AccountConsole = AccountConsole;
//# sourceMappingURL=account.console.js.map