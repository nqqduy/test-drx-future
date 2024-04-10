import { TransactionEntity } from 'src/models/entities/transaction.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
export declare class TransactionRepository extends BaseRepository<TransactionEntity> {
    findRecentDeposits(date: Date, fromId: number, count: number): Promise<TransactionEntity[]>;
    findPendingWithdrawals(fromId: number, count: number): Promise<TransactionEntity[]>;
}
