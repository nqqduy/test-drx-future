"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OKX = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class OKX extends base_1.MarketCrawler {
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
            requestString += `/api/v5/market/ticker?instId=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (resp.data.length === 0) {
            console.warn(`Corrupt data in ${__filename}, please check the okx update`);
            return undefined;
        }
        const okxData = resp.data[0];
        return {
            market: 'okx',
            bid: Number(okxData.bidPx),
            ask: Number(okxData.askPx),
            index: Number(okxData.last),
        };
    }
}
exports.OKX = OKX;
//# sourceMappingURL=base.okx.js.map