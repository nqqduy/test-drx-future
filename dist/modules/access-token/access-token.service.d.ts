import { AccessToken } from 'src/models/entities/access-tokens.entity';
import { AccessTokenRepository } from 'src/models/repositories/access-token.repository';
export declare class AccessTokenService {
    readonly accessTokenRepoReport: AccessTokenRepository;
    readonly accessTokenRepoMaster: AccessTokenRepository;
    static DEFAULT_7DAY_MS: number;
    constructor(accessTokenRepoReport: AccessTokenRepository, accessTokenRepoMaster: AccessTokenRepository);
    addAccessToken(token: string, userId: number): Promise<AccessToken>;
    removeAccessToken(token: string, userId: number): Promise<{
        message: string;
    }>;
    revokeAllTokens(userId: number): Promise<{
        message: string;
    }>;
}
