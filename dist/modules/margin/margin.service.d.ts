import { AccountRepository } from 'src/models/repositories/account.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { BaseEngineService } from 'src/modules/matching-engine/base-engine.service';
export declare class MarginService extends BaseEngineService {
    readonly positionRepoReport: PositionRepository;
    readonly positionRepoMaster: PositionRepository;
    readonly accountRepoReport: AccountRepository;
    readonly accountRepoMaster: AccountRepository;
    constructor(positionRepoReport: PositionRepository, positionRepoMaster: PositionRepository, accountRepoReport: AccountRepository, accountRepoMaster: AccountRepository);
}
