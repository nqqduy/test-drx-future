import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { RefreshAccessTokenDto } from 'src/modules/auth/dto/refresh-access-token.dto';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { JwtPayload } from 'src/modules/auth/strategies/jwt.payload';
import { UserService } from 'src/modules/user/users.service';
export declare class AuthService {
    private userService;
    private cacheManager;
    private jwtService;
    private web3;
    constructor(userService: UserService, cacheManager: Cache, jwtService: JwtService);
    refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<ResponseLogin>;
    generateAccessToken(payload: JwtPayload): {
        accessToken: string;
    };
    generateRefreshToken(accessToken: string): Promise<{
        refreshToken: string;
    }>;
    verifyAccessToken(accessToken: string): Promise<Record<string, unknown>>;
    decodeAccessToken(accessToken: string): Promise<JwtPayload | any>;
    listApiKey(address: string): Promise<any>;
    createApiKey(address: string): Promise<any>;
    deleteApiKey(apiKey: string): Promise<{
        apiKey: string;
    }>;
}
