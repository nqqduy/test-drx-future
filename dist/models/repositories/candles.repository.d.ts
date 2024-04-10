import { CandlesEntity } from 'src/models/entities/candles.entity';
import { Repository } from 'typeorm';
export declare class CandlesRepository extends Repository<CandlesEntity> {
    getLastCandleBefore(symbol: string, time: number): Promise<CandlesEntity | undefined>;
    getCandlesInRange(symbol: string, time: number, resolution: number): Promise<CandlesEntity[]>;
    getLastCandleOfResolution(symbol: string, resolution: number): Promise<CandlesEntity | undefined>;
}
