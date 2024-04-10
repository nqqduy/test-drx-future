import { ContractType } from 'src/shares/enums/order.enum';
import { AssetsService } from './assets.service';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    getAllAssets(contractType: ContractType): Promise<string[]>;
}
