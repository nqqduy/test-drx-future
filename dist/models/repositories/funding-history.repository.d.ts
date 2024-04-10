import { FundingHistoryEntity } from 'src/models/entities/funding-history.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
export declare class FundingHistoryRepository extends BaseRepository<FundingHistoryEntity> {
    findHistoryBefore(date: any): Promise<FundingHistoryEntity | undefined>;
}
