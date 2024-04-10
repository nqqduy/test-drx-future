import { FundingEntity } from 'src/models/entities/funding.entity';
import { AccountService } from 'src/modules/account/account.service';
import { FundingService } from 'src/modules/funding/funding.service';
import { FromToDto } from 'src/shares/dtos/from-to.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
export declare class FundingController {
    private readonly fundingService;
    private readonly accountService;
    constructor(fundingService: FundingService, accountService: AccountService);
    getFundingHistoryByAccountId(symbol: string): Promise<any[]>;
    getFundingRatesFromTo(symbol: string, fromTo: FromToDto): Promise<ResponseDto<FundingEntity[]>>;
}
