export declare const jwtConstants: {
    accessTokenSecret: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
};
export declare const AUTH_CACHE_PREFIX = "AUTH_CACHE_PREFIX_";
export declare enum SotaDexHeader {
    ADDRESS = "sotadex-address",
    SIGNATURE = "sotadex-signature",
    APIKEY = "sotadex-api-key",
    TIMESTAMP = "sotadex-timestamp"
}
export declare const API_KEY_PERMISSION: {
    ID: string;
    NAME: string;
};
export declare const API_METHOD: string[];
export declare const EXPIRED = 60;
