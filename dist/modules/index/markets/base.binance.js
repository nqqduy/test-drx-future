"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binance = void 0;
const base_1 = require("./base");
const index_dto_1 = require("../dto/index.dto");
class Binance extends base_1.MarketCrawler {
    constructor() {
        super();
    }
    createRequestString(metadata) {
        const requestStrings = [];
        for (const index in metadata.pairs) {
            let requestString = metadata.baseUrl.trim();
            requestString += `/api/v3/klines?symbol=${metadata.pairs[Number(index)].symbol}`;
            if (metadata.interval) {
                requestString += `&interval=${metadata.interval}`;
            }
            else {
                requestString += '&interval=1m';
            }
            if (metadata.limit) {
                requestString += `&limit=${metadata.limit}`;
            }
            else {
                requestString += '&limit=100';
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
            if (data.length <= 6) {
                console.warn(`Corrupt data in ${__filename}, please check the  binance update`);
                continue;
            }
            output.push({
                market: 'binance',
                timestamp: data[0],
                open: data[1],
                high: data[2],
                low: data[3],
                close: data[4],
                volume: data[5],
            });
        }
        return output;
    }
    createRequestStringForMarket(metadata) {
        const requestStrings = [];
        for (const index in metadata.pairs) {
            let requestString = metadata.baseUrl.trim();
            requestString += `/api/v3/ticker/24hr?symbol=${metadata.pairs[index].symbol}`;
            requestStrings.push(requestString);
        }
        return requestStrings;
    }
    transformResponseMaketIndex(resp) {
        if (!(Object.keys(resp).includes('bidPrice') &&
            Object.keys(resp).includes('askPrice') &&
            Object.keys(resp).includes('lastPrice'))) {
            console.log(resp);
            console.warn(`Corrupt data in ${__filename}, please check the  coinbase update`);
            return undefined;
        }
        return {
            market: 'binance',
            bid: resp.bidPrice,
            ask: resp.askPrice,
            index: resp.lastPrice,
        };
    }
}
exports.Binance = Binance;
//# sourceMappingURL=base.binance.js.map