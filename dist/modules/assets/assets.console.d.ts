import { AssetsRepository } from 'src/models/repositories/assets.repository';
export default class AssetsSeedCommand {
    readonly assetsRepository: AssetsRepository;
    constructor(assetsRepository: AssetsRepository);
    seedAssets(): Promise<void>;
}
