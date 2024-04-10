import { AccountEntity } from 'src/models/entities/account.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
export declare class AccountRepository extends BaseRepository<AccountEntity> {
    getFirstAccountByAddress(address: string): Promise<AccountEntity>;
    getAccountsByIds(ids: string[]): Promise<AccountEntity[]>;
    getAccountsById(id: number): Promise<AccountEntity>;
}
