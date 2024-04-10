import { AccountHistoryEntity } from 'src/models/entities/account-history.entity';
import { AccountEntity } from 'src/models/entities/account.entity';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { AccountService } from 'src/modules/account/account.service';
import { WithdrawalDto } from 'src/modules/account/dto/body-withdraw.dto';
import { FromToDto } from 'src/shares/dtos/from-to.dto';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { BalanceDto } from './dto/balance.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    getAccountByUserId(userId: number): Promise<ResponseDto<AccountEntity>>;
    getAllAccountByOwner(userId: number, symbol: string): Promise<ResponseDto<AccountEntity>>;
    withdrawal(ownerId: number, withdrawDto: WithdrawalDto): Promise<ResponseDto<unknown>>;
    getAccountBalanceFromTo(userId: number, ft: FromToDto, symbol: string): Promise<ResponseDto<AccountHistoryEntity[]>>;
    getBalance(userId: number, symbol: string): Promise<BalanceDto>;
    getTransferHistory(userId: number, paging: PaginationDto, type: string, symbol: string): Promise<ResponseDto<TransactionEntity[]>>;
}
