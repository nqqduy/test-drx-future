"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coinbase = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Coinbase extends base_1.MarketCrawler {
    constructor() {
        super();
    }
    createRequestString(metadata) {
        const requestStrings = [];
        for (const index in metadata.pairs) {
            let requestString = metadata.baseUrl.trim();
            requestString += `/products/${metadata.pairs[Number(index)].symbol}/candles?`;
            if (metadata.granularity) {
                requestString += `granularity=${metadata.granularity}`;
            }
            else {
                requestString += 'granularity=60';
            }
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponse(resp) {
        const respData = resp;
        const output = [];
        console.log(respData);
        for (const index in respData) {
            const data = respData[index];
            if (data.length != 6) {
                console.log(data);
                console.warn(`Corrupt data in ${__filename}, please check the  coinbase update`);
                continue;
            }
            output.push({
                market: 'coinbase',
                timestamp: data[0] * 1000,
                low: data[1],
                high: data[2],
                open: data[3],
                close: data[4],
                volume: data[5],
            });
        }
        return output;
    }
    createRequestStringForMarket(metadata) {
        console.log(metadata);
        const requestStrings = [];
        for (const index in metadata.pairs) {
            let requestString = metadata.baseUrl.trim();
            requestString += `/products/${metadata.pairs[index].symbol}/ticker?limit=1`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!(Object.keys(resp).includes('price') && Object.keys(resp).includes('bid') && Object.keys(resp).includes('ask'))) {
            console.log(resp);
            console.warn(`Corrupt data in ${__filename}, please check the  coinbase update`);
            return undefined;
        }
        return {
            market: 'coinbase',
            bid: resp.bid,
            ask: resp.ask,
            index: resp.price,
        };
    }
}
exports.Coinbase = Coinbase;
//# sourceMappingURL=base.coinbase.js.map