import { LeverageMarginEntity } from 'src/models/entities/leverage-margin.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
export declare class LeverageMarginRepository extends BaseRepository<LeverageMarginEntity> {
    getLeverageMargin(args: any): Promise<LeverageMarginEntity | undefined>;
}
