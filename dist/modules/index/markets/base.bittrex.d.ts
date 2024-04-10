import { MarketCrawler } from 'src/modules/index/markets/base';
import { CandleData, CandleResponseDTO, MarketData, MetaMarketDTO, BittrexResponse } from 'src/modules/index/dto/index.dto';
export declare class Bittrex extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: BittrexResponse): MarketData | undefined;
}
