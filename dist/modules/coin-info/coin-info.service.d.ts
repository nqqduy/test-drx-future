import { CoinInfoEntity } from '../../models/entities/coin-info.entity';
import { CoinInfoRepository } from '../../models/repositories/coin-info.repository';
import { Cache } from 'cache-manager';
export declare class CoinInfoService {
    private coinInfoRepository;
    private cacheManager;
    constructor(coinInfoRepository: CoinInfoRepository, cacheManager: Cache);
    getInfo(): Promise<void>;
    findCoin(coinId: string): Promise<CoinInfoEntity[]>;
    saveData(data: any): Promise<void>;
    getCoinInfo(coin: string): Promise<CoinInfoEntity>;
    getAllCoinInfo(): Promise<CoinInfoEntity[]>;
    delay(milliseconds: number): Promise<unknown>;
    insertCoinImage(): Promise<void>;
    getCurrentPriceWithBTC(symbol: string): Promise<any>;
}
