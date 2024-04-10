import { MarketCrawler } from 'src/modules/index/markets/base';
import { CandleData, CandleResponseDTO, MarketData, HuobiResponse, MetaMarketDTO } from 'src/modules/index/dto/index.dto';
export declare class Huobi extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: HuobiResponse): MarketData | undefined;
}
