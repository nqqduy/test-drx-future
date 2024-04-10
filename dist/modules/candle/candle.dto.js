"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_CANDLE = exports.CandleData = exports.CachedSymbols = void 0;
const candle_const_1 = require("./candle.const");
class CachedSymbols {
}
exports.CachedSymbols = CachedSymbols;
class CandleData {
}
exports.CandleData = CandleData;
exports.EMPTY_CANDLE = {
    symbol: '',
    minute: 0,
    resolution: candle_const_1.RESOLUTION_MINUTE,
    low: '0',
    high: '0',
    open: '0',
    close: '0',
    volume: '0',
    lastTradeTime: 0,
};
//# sourceMappingURL=candle.dto.js.map