export declare const sleep: (time: number) => Promise<void>;
export declare const emptyWeb3: any;
export declare const checkRecoverSameAddress: ({ address, signature, message, }: {
    address: string;
    signature: string;
    message: string;
}) => Promise<boolean>;
export declare const getRandomDeviateNumber: (sourceNumber: number, fromDeviation: number, toDeviation: number) => number;
