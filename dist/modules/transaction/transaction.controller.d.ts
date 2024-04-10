import { TransactionHistoryDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private readonly transactionnModeService;
    constructor(transactionnModeService: TransactionService);
    getTransactions(userId: number, input: TransactionHistoryDto): Promise<{
        data: {
            list: any[];
            count: number;
        };
    }>;
}
