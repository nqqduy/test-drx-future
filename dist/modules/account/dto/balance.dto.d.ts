import { AccountEntity } from 'src/models/entities/account.entity';
declare const BalanceDto_base: import("@nestjs/common").Type<Partial<AccountEntity>>;
export declare class BalanceDto extends BalanceDto_base {
    balance?: string;
    availableBalance?: string;
    crossBalance?: string;
    isolatedBalance?: string;
    maxAvailableBalance?: string;
}
export {};
