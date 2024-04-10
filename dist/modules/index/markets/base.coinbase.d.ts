import { MarketCrawler } from 'src/modules/index/markets/base';
import { CandleData, CandleResponseDTO, CoinbaseResponse, MarketData, MetaMarketDTO } from 'src/modules/index/dto/index.dto';
export declare class Coinbase extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: CoinbaseResponse): MarketData | undefined;
}
