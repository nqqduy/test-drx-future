export declare class FundingEntity {
    id: number;
    symbol: string;
    time: Date;
    fundingInterval: string;
    fundingRateDaily: string;
    fundingRate: string;
    oraclePrice: string;
    paid: boolean;
    nextFunding: number;
    createdAt: Date;
    updatedAt: Date;
}
