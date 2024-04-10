import { Logger } from '@nestjs/common';
import { SolDexService } from 'src/modules/dex/service/sol-dex.service';
export declare class SolDexConsole {
    private logger;
    private solDexService;
    constructor(logger: Logger, solDexService: SolDexService);
    dexActionsPicker(): Promise<void>;
    dexActionsSender(): Promise<void>;
    dexActionsVerifier(): Promise<void>;
    dexActionsSignature(): Promise<void>;
    dexActionsHistory(): Promise<void>;
}
