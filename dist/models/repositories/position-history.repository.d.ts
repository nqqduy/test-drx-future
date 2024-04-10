import { PositionHistoryEntity } from 'src/models/entities/position-history.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
export declare class PositionHistoryRepository extends BaseRepository<PositionHistoryEntity> {
    findHistoryBefore(date: any): Promise<PositionHistoryEntity | undefined>;
}
