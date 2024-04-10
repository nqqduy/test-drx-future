"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const candle_const_1 = require("./candle.const");
const candle_service_1 = require("./candle.service");
let CandlesController = class CandlesController {
    constructor(candleService) {
        this.candleService = candleService;
    }
    get1m(symbol, from, to, resolution) {
        return this.candleService.getCandles(symbol, from, to, resolution);
    }
};
tslib_1.__decorate([
    common_1.Get(':symbol/candles'),
    swagger_1.ApiOperation({
        description: 'Get candle data. From, to is timestamp of range time. Symbol get from /api/v1/ticker/24h',
    }),
    tslib_1.__param(0, common_1.Param('symbol')),
    tslib_1.__param(1, common_1.Query('from')),
    tslib_1.__param(2, common_1.Query('to')),
    tslib_1.__param(3, common_1.Query('resolution')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], CandlesController.prototype, "get1m", null);
CandlesController = tslib_1.__decorate([
    common_1.Controller('candle'),
    swagger_1.ApiTags('Candle'),
    tslib_1.__metadata("design:paramtypes", [candle_service_1.CandleService])
], CandlesController);
exports.CandlesController = CandlesController;
//# sourceMappingURL=candle.controller.js.map