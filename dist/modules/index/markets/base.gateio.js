"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateIO = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class GateIO extends base_1.MarketCrawler {
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
            requestString += `/api2/1/ticker/${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!resp.highestBid || !resp.lowestAsk || !resp.last) {
            console.warn(`Corrupt data in ${__filename}, please check the gateio update`);
            return undefined;
        }
        return {
            market: 'gateio',
            bid: Number(resp.highestBid),
            ask: Number(resp.lowestAsk),
            index: Number(resp.last),
        };
    }
}
exports.GateIO = GateIO;
//# sourceMappingURL=base.gateio.js.map