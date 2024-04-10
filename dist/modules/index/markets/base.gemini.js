"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gemini = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Gemini extends base_1.MarketCrawler {
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
        if (resp.last == undefined) {
            console.log(resp);
            console.warn(`Corrupt data in ${__filename}, please check the gemini update`);
            return undefined;
        }
        return {
            market: 'gemini',
            bid: Number(resp.last),
            ask: Number(resp.last),
            index: Number(resp.last),
        };
    }
}
exports.Gemini = Gemini;
//# sourceMappingURL=base.gemini.js.map