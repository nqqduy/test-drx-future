"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfoConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const coin_info_service_1 = require("./coin-info.service");
let CoinInfoConsole = class CoinInfoConsole {
    constructor(coinInfoService) {
        this.coinInfoService = coinInfoService;
    }
    async getCoinInfo() {
        await this.coinInfoService.getInfo();
    }
    async insertCoinInfo() {
        await this.coinInfoService.insertCoinImage();
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'crawler:coin-info',
        description: 'Crawler coin info from coingecko',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CoinInfoConsole.prototype, "getCoinInfo", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'coin-info:insert-image',
        description: 'insert image in coin info',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CoinInfoConsole.prototype, "insertCoinInfo", null);
CoinInfoConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [coin_info_service_1.CoinInfoService])
], CoinInfoConsole);
exports.CoinInfoConsole = CoinInfoConsole;
//# sourceMappingURL=coin-info.console.js.map