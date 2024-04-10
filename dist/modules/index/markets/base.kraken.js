"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kraken = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Kraken extends base_1.MarketCrawler {
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
            requestString += `/0/public/Ticker?pair=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!resp.result) {
            console.warn(`Corrupt data in ${__filename}, please check the kraken update`);
            return undefined;
        }
        const symbols = Object.keys(resp.result);
        if (symbols.length === 0) {
            console.warn(`Corrupt data in ${__filename}, please check the kraken update`);
            return undefined;
        }
        const krakenData = resp.result[symbols[0]];
        return {
            market: 'kraken',
            bid: Number(krakenData.b[0]),
            ask: Number(krakenData.a[0]),
            index: Number(krakenData.c[0]),
        };
    }
}
exports.Kraken = Kraken;
//# sourceMappingURL=base.kraken.js.map