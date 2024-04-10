import { AuthService } from 'src/modules/auth/auth.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { RefreshAccessTokenDto } from 'src/modules/auth/dto/refresh-access-token.dto';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserService } from 'src/modules/user/users.service';
import { MailService } from 'src/modules/mail/mail.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly mailService;
    constructor(authService: AuthService, userService: UserService, mailService: MailService);
    currentUser(userId: number): Promise<ResponseDto<UserEntity & {
        pendingEmail: string;
    }>>;
    refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<ResponseDto<Partial<ResponseLogin>>>;
    me(userId: number): Promise<ResponseDto<UserEntity>>;
}
