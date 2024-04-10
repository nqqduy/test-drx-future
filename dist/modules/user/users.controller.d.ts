import { UserEntity } from 'src/models/entities/user.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { FavoriteMarket } from 'src/modules/user/dto/favorite-market.dto';
import { UpdateFavoriteMarketDto } from 'src/modules/user/dto/update-favorite-market.dto';
import { UserService } from 'src/modules/user/users.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UserController {
    private userService;
    private readonly mailService;
    constructor(userService: UserService, mailService: MailService);
    insertUser(body: CreateUserDto): Promise<ResponseDto<UserEntity>>;
    getFavoriteMarket(userId: number): Promise<ResponseDto<FavoriteMarket[]>>;
    addFavoriteMarket(userId: number, updateFavoriteMarketDto: UpdateFavoriteMarketDto): Promise<ResponseDto<{
        symbol: string;
        isFavorite: boolean;
    }>>;
}
