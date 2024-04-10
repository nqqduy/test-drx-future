"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitfinex = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Bitfinex extends base_1.MarketCrawler {
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
            requestString += `/v1/pubticker/${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!resp.ask || !resp.bid || !resp.last_price) {
            console.warn(`Corrupt data in ${__filename}, please check the bitfinex update`);
            return undefined;
        }
        return {
            market: 'bitfinex',
            bid: Number(resp.bid),
            ask: Number(resp.ask),
            index: Number(resp.last_price),
        };
    }
}
exports.Bitfinex = Bitfinex;
//# sourceMappingURL=base.bitfinex.js.map