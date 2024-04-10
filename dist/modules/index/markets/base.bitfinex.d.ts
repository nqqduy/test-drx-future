import { MarketCrawler } from 'src/modules/index/markets/base';
import { CandleData, CandleResponseDTO, MarketData, MetaMarketDTO, BitfinexResponse } from 'src/modules/index/dto/index.dto';
export declare class Bitfinex extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: BitfinexResponse): MarketData | undefined;
}
