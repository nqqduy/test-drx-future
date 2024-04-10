"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const position_service_1 = require("./position.service");
let PositionConsole = class PositionConsole {
    constructor(positionService) {
        this.positionService = positionService;
    }
    async updatePositions() {
        await this.positionService.updatePositions();
    }
    async closeAllPositionCommand(symbol) {
        await this.positionService.closeAllPositionCommand(symbol);
    }
    async updateIdPositionCommand() {
        await this.positionService.updateIdPositionCommand();
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'position:update-new-account',
        description: 'update new account in position',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PositionConsole.prototype, "updatePositions", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'position:close-all [symbol]',
        description: 'Close all positions',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PositionConsole.prototype, "closeAllPositionCommand", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'position:update-id-position',
        description: 'Update id positions',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PositionConsole.prototype, "updateIdPositionCommand", null);
PositionConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [position_service_1.PositionService])
], PositionConsole);
exports.PositionConsole = PositionConsole;
//# sourceMappingURL=position.console.js.map