"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinInfoController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coin_info_service_1 = require("./coin-info.service");
let CoinInfoController = class CoinInfoController {
    constructor(coinInfoService) {
        this.coinInfoService = coinInfoService;
    }
    async index(coin) {
        return await this.coinInfoService.getCoinInfo(coin);
    }
    async getCurrentPriceWithBTC(coin) {
        return await this.coinInfoService.getCurrentPriceWithBTC(coin);
    }
};
tslib_1.__decorate([
    common_1.Get(''),
    tslib_1.__param(0, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CoinInfoController.prototype, "index", null);
tslib_1.__decorate([
    common_1.Get('get-price-vs-btc'),
    tslib_1.__param(0, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CoinInfoController.prototype, "getCurrentPriceWithBTC", null);
CoinInfoController = tslib_1.__decorate([
    swagger_1.ApiTags('CoinInfo'),
    common_1.Controller('coin-info'),
    tslib_1.__metadata("design:paramtypes", [coin_info_service_1.CoinInfoService])
], CoinInfoController);
exports.CoinInfoController = CoinInfoController;
//# sourceMappingURL=coin-info.controller.js.map