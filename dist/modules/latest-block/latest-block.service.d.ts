import { LatestBlockEntity } from 'src/models/entities/latest-block.entity';
import { LatestBlockRepository } from 'src/models/repositories/latest-block.repository';
export declare class LatestBlockService {
    readonly latestBlockRepoMaster: LatestBlockRepository;
    constructor(latestBlockRepoMaster: LatestBlockRepository);
    saveLatestBlock(service: string, block: number, latestBlockRepository?: LatestBlockRepository): Promise<void>;
    getLatestBlock(service: string): Promise<LatestBlockEntity>;
    updateLatestBlockStatus(latestBlock: LatestBlockEntity): Promise<LatestBlockEntity>;
}
