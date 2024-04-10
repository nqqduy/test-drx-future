"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ticker_const_1 = require("./ticker.const");
const ticker_service_1 = require("./ticker.service");
const response_dto_1 = require("../../shares/dtos/response.dto");
let TickerController = class TickerController {
    constructor(tickerService) {
        this.tickerService = tickerService;
    }
    async get(contractType, symbol) {
        return {
            data: await this.tickerService.getTickers(contractType, symbol),
        };
    }
};
tslib_1.__decorate([
    common_1.Get('/24h'),
    swagger_1.ApiQuery({
        name: 'contractType',
        required: false,
        example: 'USD_M',
        enum: ['USD_M', 'COIN_M'],
    }),
    swagger_1.ApiQuery({
        name: 'symbol',
        required: false,
        example: 'BTCUSDT',
    }),
    tslib_1.__param(0, common_1.Query('contractType')),
    tslib_1.__param(1, common_1.Query('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TickerController.prototype, "get", null);
TickerController = tslib_1.__decorate([
    common_1.Controller('ticker'),
    swagger_1.ApiTags('Ticker'),
    tslib_1.__metadata("design:paramtypes", [ticker_service_1.TickerService])
], TickerController);
exports.TickerController = TickerController;
//# sourceMappingURL=ticker.controller.js.map