import { UserSettingEntity } from 'src/models/entities/user-setting.entity';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { UpdateNotificationSettingDto } from './dto/user-setting-dto';
import { UserSettingeService } from './user-setting.service';
export declare class UserSettingController {
    private readonly userSettingService;
    constructor(userSettingService: UserSettingeService);
    updateUserPreferenceSetting(body: UpdateNotificationSettingDto, userId: number): Promise<ResponseDto<UserSettingEntity>>;
    getUserPreferenceSetting(userId: number): Promise<ResponseDto<UserSettingEntity>>;
}
