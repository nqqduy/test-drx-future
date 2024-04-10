"use strict";
var CandleConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const candle_service_1 = require("./candle.service");
let CandleConsole = CandleConsole_1 = class CandleConsole {
    constructor(candleService) {
        this.candleService = candleService;
        this.logger = new common_1.Logger(CandleConsole_1.name);
    }
    async syncCandles() {
        await this.candleService.syncCandles();
    }
    async syncTrades() {
        await this.candleService.syncTrades();
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'candles:sync-candles',
        description: 'Save output from matching engine',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CandleConsole.prototype, "syncCandles", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'candles:sync-trades',
        description: 'Save output from matching engine',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CandleConsole.prototype, "syncTrades", null);
CandleConsole = CandleConsole_1 = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [candle_service_1.CandleService])
], CandleConsole);
exports.CandleConsole = CandleConsole;
//# sourceMappingURL=candle.console.js.map