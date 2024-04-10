"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Huobi = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Huobi extends base_1.MarketCrawler {
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
            requestString += `/market/trade?symbol=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!Object.keys(resp).includes('status') || resp.status != 'ok' || !Object.keys(resp).includes('tick')) {
            console.log(resp);
            console.warn(`Corrupt resp in ${__filename}, please check the  huobi update`);
            return undefined;
        }
        const data = resp.tick.data;
        if (data.length == 0) {
            console.warn(`Corrupt data in ${__filename}, please check the  huobi update`);
            return undefined;
        }
        return {
            market: 'huobi',
            bid: data[0].price,
            ask: data[0].price,
            index: data[0].price,
        };
    }
}
exports.Huobi = Huobi;
//# sourceMappingURL=base.huobi.js.map