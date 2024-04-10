export declare class AssetTokenDto {
    asset: string;
    balance: string;
    estimateBTC: string;
    estimateUSD: string;
}
export declare class AssetsDto {
    assets: AssetTokenDto[];
    totalWalletBalance: string;
}
