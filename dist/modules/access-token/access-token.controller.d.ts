import { AccessToken } from 'src/models/entities/access-tokens.entity';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { AccessTokenService } from './access-token.service';
import { AccessTokenDto } from './dto/add-token.dto';
export declare class AccessTokenController {
    private readonly accessTokenService;
    constructor(accessTokenService: AccessTokenService);
    addAccessToken(body: AccessTokenDto, userId: number): Promise<ResponseDto<AccessToken>>;
    removeAccessToken(body: AccessTokenDto, userId: number): Promise<{
        data: {
            message: string;
        };
    }>;
    revokeAllTokens(userId: number): Promise<{
        data: {
            message: string;
        };
    }>;
}
