import { Contract, providers, Wallet } from 'ethers';
export declare const Dex: {
    provider: providers.JsonRpcProvider;
    dexContract: Contract;
    matcherWallet: Wallet;
    withdrawerWallet: Wallet;
    collateralDecimal: number;
    defaultScale: number;
    blockTimeInMs: number;
    chainId: number;
    actionBatchSize: number;
    runningChain: string;
};
