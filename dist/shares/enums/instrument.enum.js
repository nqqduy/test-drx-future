"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTRUMENT = exports.InstrumentHasLiquidity = exports.InstrumentDeleverageable = exports.InstrumentTypes = void 0;
const enumize_1 = require("./enumize");
exports.InstrumentTypes = enumize_1.enumize('COIN_M', 'USD_M');
exports.InstrumentDeleverageable = enumize_1.enumize('UNDELEVERAGEABLED', 'DELEVERAGEABLED');
exports.InstrumentHasLiquidity = enumize_1.enumize('HAS_LIQUIDITY', 'HAS_NOT_LIQUIDITY');
var INSTRUMENT;
(function (INSTRUMENT) {
    INSTRUMENT["MULTIPLIER_DEFAULT_VALUE"] = "1";
})(INSTRUMENT = exports.INSTRUMENT || (exports.INSTRUMENT = {}));
//# sourceMappingURL=instrument.enum.js.map