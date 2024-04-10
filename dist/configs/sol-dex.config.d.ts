/// <reference types="bn.js" />
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
export declare const SolDex: {
    processedConnection: Connection;
    connection: Connection;
    dexId: anchor.BN;
    provider: anchor.Provider;
    dexProgram: anchor.Program<import("src/idl/sotadex_solana").SotadexSolana>;
    matcherKeypair: Keypair;
    matcherWallet: NodeWallet;
    collateralDecimal: number;
    defaultScale: number;
    blockTimeInMs: number;
    actionBatchSize: number;
    usdcId: PublicKey;
    dexContract: any;
    finalizedConnection: Connection;
};
