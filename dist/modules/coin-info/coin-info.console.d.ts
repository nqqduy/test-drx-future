import { CoinInfoService } from './coin-info.service';
export declare class CoinInfoConsole {
    private coinInfoService;
    constructor(coinInfoService: CoinInfoService);
    getCoinInfo(): Promise<void>;
    insertCoinInfo(): Promise<void>;
}
