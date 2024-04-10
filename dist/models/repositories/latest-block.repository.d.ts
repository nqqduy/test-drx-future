import { LatestBlockEntity } from 'src/models/entities/latest-block.entity';
import { Repository } from 'typeorm';
export declare class LatestBlockRepository extends Repository<LatestBlockEntity> {
    saveLatestBlock(service: string, block: number): Promise<void>;
}
