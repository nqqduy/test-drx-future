import { MarketCrawler } from 'src/modules/index/markets/base';
import { CandleData, CandleResponseDTO, MarketData, GeminiResponse, MetaMarketDTO } from 'src/modules/index/dto/index.dto';
export declare class Gemini extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: GeminiResponse): MarketData | undefined;
}
