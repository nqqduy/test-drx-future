import { CandleData, CandleResponseDTO, MetaMarketDTO, BaseMarketResponseDTO, MarketData } from 'src/modules/index/dto/index.dto';
export declare class MarketCrawler {
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: BaseMarketResponseDTO): MarketData;
}
