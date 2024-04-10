"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitbtc = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Hitbtc extends base_1.MarketCrawler {
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
            requestString += `/api/3/public/ticker?symbols=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        const symbols = Object.keys(resp);
        if (symbols.length === 0) {
            console.warn(`Corrupt data in ${__filename}, please check the bitbtc update`);
            return undefined;
        }
        const hitbtcData = resp[symbols[0]];
        return {
            market: 'hitbtc',
            bid: Number(hitbtcData.bid),
            ask: Number(hitbtcData.ask),
            index: Number(hitbtcData.last),
        };
    }
}
exports.Hitbtc = Hitbtc;
//# sourceMappingURL=base.hitbtc.js.map