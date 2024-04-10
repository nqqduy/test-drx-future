import { CoinInfoService } from './coin-info.service';
export declare class CoinInfoController {
    private readonly coinInfoService;
    constructor(coinInfoService: CoinInfoService);
    index(coin: string): Promise<import("../../models/entities/coin-info.entity").CoinInfoEntity>;
    getCurrentPriceWithBTC(coin: string): Promise<any>;
}
