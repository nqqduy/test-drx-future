"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolDexConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const sol_dex_service_1 = require("../service/sol-dex.service");
let SolDexConsole = class SolDexConsole {
    constructor(logger, solDexService) {
        this.logger = logger;
        this.solDexService = solDexService;
        this.logger.setContext('SolDexConsole');
    }
    async dexActionsPicker() {
        await this.solDexService.handlePickDexActions();
        return new Promise(() => { });
    }
    async dexActionsSender() {
        await this.solDexService.handleSendDexActions();
        return new Promise(() => { });
    }
    async dexActionsVerifier() {
        await this.solDexService.handleVerifyDexActions();
        return new Promise(() => { });
    }
    async dexActionsSignature() {
        await this.solDexService.handleCrawlSignature();
        return new Promise(() => { });
    }
    async dexActionsHistory() {
        await this.solDexService.handleHistoryDexActions();
        return new Promise(() => { });
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'sol-dex:action-picker',
        description: 'Dex Action Picker',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SolDexConsole.prototype, "dexActionsPicker", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'sol-dex:action-sender',
        description: 'Dex Action Sender',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SolDexConsole.prototype, "dexActionsSender", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'sol-dex:action-verifier',
        description: 'Dex Action Verifier',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SolDexConsole.prototype, "dexActionsVerifier", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'sol-dex:action-signature',
        description: 'Dex Action Crawl Signature',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SolDexConsole.prototype, "dexActionsSignature", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'sol-dex:action-history',
        description: 'Dex Action History',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SolDexConsole.prototype, "dexActionsHistory", null);
SolDexConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [common_1.Logger, sol_dex_service_1.SolDexService])
], SolDexConsole);
exports.SolDexConsole = SolDexConsole;
//# sourceMappingURL=sol-dex.console.js.map