"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orderbook_const_1 = require("./orderbook.const");
const orderbook_service_1 = require("./orderbook.service");
let OrderbookController = class OrderbookController {
    constructor(orderbookService) {
        this.orderbookService = orderbookService;
    }
    get(symbol) {
        return this.orderbookService.getOrderbook(symbol);
    }
};
tslib_1.__decorate([
    common_1.Get('/:symbol'),
    tslib_1.__param(0, common_1.Param('symbol')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderbookController.prototype, "get", null);
OrderbookController = tslib_1.__decorate([
    common_1.Controller('orderbook'),
    swagger_1.ApiTags('Orderbook'),
    tslib_1.__metadata("design:paramtypes", [orderbook_service_1.OrderbookService])
], OrderbookController);
exports.OrderbookController = OrderbookController;
//# sourceMappingURL=orderbook.controller.js.map