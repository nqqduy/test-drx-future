"use strict";
var OrderbookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const orderbook_const_1 = require("./orderbook.const");
let OrderbookService = OrderbookService_1 = class OrderbookService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    static getOrderbookKey(symbol) {
        return `orderbook_${symbol}`;
    }
    async getOrderbook(symbol) {
        const orderbook = await this.cacheManager.get(OrderbookService_1.getOrderbookKey(symbol));
        if (!orderbook) {
            return {
                bids: [],
                asks: [],
            };
        }
        else {
            return orderbook;
        }
    }
};
OrderbookService = OrderbookService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, common_1.Inject(common_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object])
], OrderbookService);
exports.OrderbookService = OrderbookService;
//# sourceMappingURL=orderbook.service.js.map