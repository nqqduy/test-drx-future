import { LeverageMarginEntity } from 'src/models/entities/leverage-margin.entity';
import { LeverageMarginRepository } from 'src/models/repositories/leverage-margin.repository';
import { LeverageMarginDto } from './dto/leverage-margin.dto';
import { BaseEngineService } from '../matching-engine/base-engine.service';
import { Cache } from 'cache-manager';
import { ContractType } from 'src/shares/enums/order.enum';
export declare class LeverageMarginService extends BaseEngineService {
    readonly leverageMarginRepoReport: LeverageMarginRepository;
    readonly leverageMarginRepoMaster: LeverageMarginRepository;
    private cacheManager;
    constructor(leverageMarginRepoReport: LeverageMarginRepository, leverageMarginRepoMaster: LeverageMarginRepository, cacheManager: Cache);
    findAll(): Promise<LeverageMarginEntity[]>;
    findBy(arg: any): Promise<LeverageMarginEntity[]>;
    findAllByContract(contractType: ContractType): Promise<LeverageMarginEntity[]>;
    upsertLeverageMargin(leverageMarginDto: LeverageMarginDto): Promise<LeverageMarginEntity>;
    findAllAndGetInstrumentData(): Promise<unknown>;
}
