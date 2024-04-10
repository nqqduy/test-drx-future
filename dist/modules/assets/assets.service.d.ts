import { AssetsRepository } from 'src/models/repositories/assets.repository';
import { Cache } from 'cache-manager';
import { ContractType } from 'src/shares/enums/order.enum';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
export declare class AssetsService {
    readonly assetsRepoReport: AssetsRepository;
    readonly assetsRepoMaster: AssetsRepository;
    readonly instrumentRepoReport: InstrumentRepository;
    private cacheManager;
    constructor(assetsRepoReport: AssetsRepository, assetsRepoMaster: AssetsRepository, instrumentRepoReport: InstrumentRepository, cacheManager: Cache);
    findAllAssets(contractType: ContractType): Promise<string[]>;
}
