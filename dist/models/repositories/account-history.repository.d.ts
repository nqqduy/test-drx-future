import { AccountHistoryEntity } from 'src/models/entities/account-history.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
import { InsertResult } from 'typeorm';
export declare class AccountHistoryRepository extends BaseRepository<AccountHistoryEntity> {
    getAccountBalanceFromTo(accountId: number, from: Date, to: Date): Promise<AccountHistoryEntity[]>;
    batchSave(entities: AccountHistoryEntity[]): Promise<InsertResult>;
}
