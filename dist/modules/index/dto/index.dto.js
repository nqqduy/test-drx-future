"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KarenResponse = exports.KarenData = exports.BitstampResponse = exports.BitfinexResponse = exports.MXCResponse = exports.BitmaxResponse = exports.GateIOResponse = exports.HitbtcResponse = exports.HitbtcData = exports.BittrexResponse = exports.OKXTickerResponse = exports.OKXTicker = exports.HuobiResponse = exports.HuobiTick = exports.HuobiData = exports.GeminiResponse = exports.CoinbaseResponse = exports.BinanceResponse = exports.BaseMarketResponseDTO = exports.MetadataMarketDTO = exports.MetadataWeightGroupDTO = exports.MetadataCandleDTO = exports.MarketData = exports.CandleData = exports.CandleResponseDTO = exports.MetaMarketDTO = exports.GeminiData = exports.GeminiVolume = exports.Pair = exports.FtxCandleDTO = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const base_1 = require("../markets/base");
class FtxCandleDTO {
}
exports.FtxCandleDTO = FtxCandleDTO;
class Pair {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], Pair.prototype, "symbol", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], Pair.prototype, "group", void 0);
exports.Pair = Pair;
class GeminiVolume {
}
exports.GeminiVolume = GeminiVolume;
class GeminiData {
}
exports.GeminiData = GeminiData;
class MetaMarketDTO {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], MetaMarketDTO.prototype, "baseUrl", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Array)
], MetaMarketDTO.prototype, "pairs", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", base_1.MarketCrawler)
], MetaMarketDTO.prototype, "base", void 0);
exports.MetaMarketDTO = MetaMarketDTO;
class CandleResponseDTO {
}
exports.CandleResponseDTO = CandleResponseDTO;
class CandleData {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CandleData.prototype, "market", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CandleData.prototype, "timestamp", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CandleData.prototype, "low", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CandleData.prototype, "high", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CandleData.prototype, "open", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CandleData.prototype, "close", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CandleData.prototype, "volume", void 0);
exports.CandleData = CandleData;
class MarketData {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], MarketData.prototype, "market", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], MarketData.prototype, "bid", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], MarketData.prototype, "ask", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], MarketData.prototype, "index", void 0);
exports.MarketData = MarketData;
class MetadataCandleDTO {
}
exports.MetadataCandleDTO = MetadataCandleDTO;
class MetadataWeightGroupDTO {
}
exports.MetadataWeightGroupDTO = MetadataWeightGroupDTO;
class MetadataMarketDTO {
}
exports.MetadataMarketDTO = MetadataMarketDTO;
class BaseMarketResponseDTO {
}
exports.BaseMarketResponseDTO = BaseMarketResponseDTO;
class BinanceResponse extends BaseMarketResponseDTO {
}
exports.BinanceResponse = BinanceResponse;
class CoinbaseResponse extends BaseMarketResponseDTO {
}
exports.CoinbaseResponse = CoinbaseResponse;
class GeminiResponse extends BaseMarketResponseDTO {
}
exports.GeminiResponse = GeminiResponse;
class HuobiData {
}
exports.HuobiData = HuobiData;
class HuobiTick {
}
exports.HuobiTick = HuobiTick;
class HuobiResponse extends BaseMarketResponseDTO {
}
exports.HuobiResponse = HuobiResponse;
class OKXTicker {
}
exports.OKXTicker = OKXTicker;
class OKXTickerResponse extends BaseMarketResponseDTO {
}
exports.OKXTickerResponse = OKXTickerResponse;
class BittrexResponse extends BaseMarketResponseDTO {
}
exports.BittrexResponse = BittrexResponse;
class HitbtcData {
}
exports.HitbtcData = HitbtcData;
class HitbtcResponse extends BaseMarketResponseDTO {
}
exports.HitbtcResponse = HitbtcResponse;
class GateIOResponse extends BaseMarketResponseDTO {
}
exports.GateIOResponse = GateIOResponse;
class BitmaxResponse extends BaseMarketResponseDTO {
}
exports.BitmaxResponse = BitmaxResponse;
class MXCResponse extends BaseMarketResponseDTO {
}
exports.MXCResponse = MXCResponse;
class BitfinexResponse extends BaseMarketResponseDTO {
}
exports.BitfinexResponse = BitfinexResponse;
class BitstampResponse extends BaseMarketResponseDTO {
}
exports.BitstampResponse = BitstampResponse;
class KarenData {
}
exports.KarenData = KarenData;
class KarenResponse extends BaseMarketResponseDTO {
}
exports.KarenResponse = KarenResponse;
//# sourceMappingURL=index.dto.js.map