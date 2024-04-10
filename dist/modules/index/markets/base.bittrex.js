"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bittrex = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Bittrex extends base_1.MarketCrawler {
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
            requestString += `/v3/markets/${metadata.pairs[index].symbol}/ticker`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!(resp === null || resp === void 0 ? void 0 : resp.lastTradeRate) || !(resp === null || resp === void 0 ? void 0 : resp.bidRate) || !(resp === null || resp === void 0 ? void 0 : resp.askRate)) {
            console.warn(`Corrupt data in ${__filename}, please check the bittrex update`);
            return undefined;
        }
        return {
            market: 'bittrex',
            bid: Number(resp.bidRate),
            ask: Number(resp.askRate),
            index: Number(resp.lastTradeRate),
        };
    }
}
exports.Bittrex = Bittrex;
//# sourceMappingURL=base.bittrex.js.map