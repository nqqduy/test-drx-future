import { MarketCrawler } from 'src/modules/index/markets/base';
import { CandleData, CandleResponseDTO, MarketData, MetaMarketDTO, KarenResponse } from 'src/modules/index/dto/index.dto';
export declare class Kraken extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: KarenResponse): MarketData | undefined;
}
