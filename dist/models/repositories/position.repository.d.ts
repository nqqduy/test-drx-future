import { PositionEntity } from 'src/models/entities/position.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
export declare class PositionRepository extends BaseRepository<PositionEntity> {
    findPositionByUserId(userId: number, symbol: string): Promise<any>;
}
