import { BaseEntity } from 'typeorm';
export declare class TransactionEntity extends BaseEntity {
    id: number;
    accountId: number;
    userId: number;
    amount: string;
    status: string;
    type: string;
    symbol: string;
    asset: string;
    operationId: number;
    contractType: string;
    createdAt: Date;
    updatedAt: Date;
}
