"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MXC = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class MXC extends base_1.MarketCrawler {
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
            requestString += `/api/v1/contract/ticker?symbol=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!resp.success) {
            console.warn(`Corrupt data in ${__filename}, please check the mxc update`);
            return undefined;
        }
        const mxcData = resp.data;
        return {
            market: 'mxc',
            bid: Number(mxcData.bid1),
            ask: Number(mxcData.ask1),
            index: Number(mxcData.lastPrice),
        };
    }
}
exports.MXC = MXC;
//# sourceMappingURL=base.mxc.js.map