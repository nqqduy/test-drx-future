import { UserSettingEntity } from 'src/models/entities/user-setting.entity';
import { Repository } from 'typeorm';
export declare class UserSettingRepository extends Repository<UserSettingEntity> {
    static FAVORITE_MARKET: string;
    getUserSettingToSendFundingFeeMail(): Promise<any[]>;
}
