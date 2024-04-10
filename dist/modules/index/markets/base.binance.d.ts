import { MarketCrawler } from 'src/modules/index/markets/base';
import { BinanceResponse, CandleData, CandleResponseDTO, MarketData, MetaMarketDTO } from 'src/modules/index/dto/index.dto';
export declare class Binance extends MarketCrawler {
    constructor();
    createRequestString(metadata: MetaMarketDTO): Array<string>;
    transformResponse(resp: CandleResponseDTO): Array<CandleData>;
    createRequestStringForMarket(metadata: MetaMarketDTO): Array<string>;
    transformResponseMaketIndex(resp: BinanceResponse): MarketData | undefined;
}
