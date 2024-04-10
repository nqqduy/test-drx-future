import { DexTransactionStatus } from 'src/modules/dex/dex.constant';
export declare class DexActionTransaction {
    id: string;
    txid?: string;
    matcherAddress?: string;
    nonce?: string;
    rawTx: string;
    status: DexTransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}
