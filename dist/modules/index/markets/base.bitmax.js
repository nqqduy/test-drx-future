"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitmax = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Bitmax extends base_1.MarketCrawler {
    constructor() {
        super();
    }
    createRequestString(metadata) {
        return [];
    }
    transformResponse(resp) {
        return [];
    }
    createRequestStringForMarket(metadata) {
        const requestStrings = [];
        for (const index in metadata.pairs) {
            let requestString = metadata.baseUrl.trim();
            requestString += `/api/pro/v1/ticker?symbol=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        const bitmaxData = resp === null || resp === void 0 ? void 0 : resp.data;
        if (!bitmaxData) {
            console.warn(`Corrupt data in ${__filename}, please check the bitmax update`);
            return undefined;
        }
        return {
            market: 'bitmax',
            bid: Number(bitmaxData.bid[0]),
            ask: Number(bitmaxData.ask[0]),
            index: Number(bitmaxData.close),
        };
    }
}
exports.Bitmax = Bitmax;
//# sourceMappingURL=base.bitmax.js.map