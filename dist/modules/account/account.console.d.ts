import { Logger } from '@nestjs/common';
import { AccountService } from 'src/modules/account/account.service';
export declare class AccountConsole {
    private readonly logger;
    private readonly accountService;
    constructor(logger: Logger, accountService: AccountService);
    saveDailyBalance(): Promise<void>;
    genInsuranceAccount(): Promise<void>;
    genNewAssetAccount(asset: string): Promise<void>;
    syncEmail(): Promise<void>;
    depositBot(): Promise<void>;
}
