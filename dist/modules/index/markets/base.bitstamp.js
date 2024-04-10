"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitstamp = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Bitstamp extends base_1.MarketCrawler {
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
            requestString += `/api/v2/ticker/${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!resp.ask || !resp.last || !resp.bid) {
            console.warn(`Corrupt data in ${__filename}, please check the bitstamp update`);
            return undefined;
        }
        return {
            market: 'bitstamp',
            bid: Number(resp.ask),
            ask: Number(resp.bid),
            index: Number(resp.last),
        };
    }
}
exports.Bitstamp = Bitstamp;
//# sourceMappingURL=base.bitstamp.js.map