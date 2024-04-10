import { BalanceService } from './balance.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { AssetsDto } from '../account/dto/assets.dto';
import { AccountEntity } from 'src/models/entities/account.entity';
import { GetInforBalanceDto } from './balance.dto';
export declare class BalanceController {
    private readonly balanceService;
    constructor(balanceService: BalanceService);
    getAllAccountByOwner(userId: number): Promise<ResponseDto<AccountEntity[]>>;
    getAssets(userId: number): Promise<AssetsDto>;
    getBalanceInfor(userId: number, query: GetInforBalanceDto): Promise<{}>;
    getBalanceFuture(userId: number, futureUser: string, futurePassword: string): Promise<{
        data: AccountEntity[];
    }>;
    getTotalBalanceAllUser(futureUser: string, futurePassword: string): Promise<{
        data: any[];
    }>;
}
