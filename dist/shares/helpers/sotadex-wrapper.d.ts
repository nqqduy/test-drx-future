/// <reference types="node" />
/// <reference types="bn.js" />
import { Program, BN } from '@project-serum/anchor';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { SotadexSolana } from 'src/idl/sotadex_solana';
import { DexLiquidationSide } from 'src/modules/dex/dex.constant';
interface FundingParams {
    id: number;
    user: string;
    amount: string;
    operationId: number;
}
interface WithdrawParams {
    id: number;
    operationId: number;
    user: string;
    amount: string;
    fee: string;
}
interface TradeParams {
    id: number;
    operationId: number;
    instrumentId: string;
    buyer: string;
    price: string;
    seller: string;
    buyerFee: string;
    quantity: string;
    sellerFee: string;
    bankruptFee: string;
    bankruptPrice: string;
    liquidationSide: DexLiquidationSide;
}
export declare const SOTADEX_SEED: Buffer;
export declare const SOTADEX_MINT_SEED: Buffer;
export declare const SOTADEX_MEMBER_SEED: Buffer;
export declare const SOTADEX_POSITION_SEED: Buffer;
export declare const LOG_START = "sotadex-log";
export declare class SotaDexWrapper {
    readonly program: Program<SotadexSolana>;
    readonly dexId: BN;
    readonly usdcId: PublicKey;
    private existsMap;
    private feeCollector;
    private insurance;
    constructor(program: Program<SotadexSolana>, dexId: BN, usdcId: PublicKey);
    getSotadexAccount(): Promise<[PublicKey, number]>;
    getSotadexTokenAccount(): Promise<[PublicKey, number]>;
    getMemberAccount(address: PublicKey): Promise<[PublicKey, number]>;
    getUsdcTokenAccount(address: PublicKey): Promise<PublicKey>;
    getMemberPositionAccount(address: PublicKey, instructionId: BN): Promise<[PublicKey, number]>;
    isAccountExist(address: PublicKey): Promise<boolean>;
    getWithdrawInstruction(dexParameter: WithdrawParams): Promise<TransactionInstruction>;
    getFundingInstruction(dexParameter: FundingParams): Promise<TransactionInstruction>;
    initPosition(instrumentId: BN, address: PublicKey): Promise<string>;
    getTradeInstruction(dexParameter: TradeParams): Promise<TransactionInstruction>;
    newTransaction(instructions: TransactionInstruction[]): Promise<Transaction>;
    fetchOnchainInfo(): Promise<void>;
    extractEvents(logMessages: string[]): any[];
    private _groupLogMessages;
}
export {};
