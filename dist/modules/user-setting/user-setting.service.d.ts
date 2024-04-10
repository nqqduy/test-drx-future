import { Logger } from '@nestjs/common';
import { UserSettingEntity } from 'src/models/entities/user-setting.entity';
import { UserSettingRepository } from 'src/models/repositories/user-setting.repository';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { UpdateNotificationSettingDto } from './dto/user-setting-dto';
export declare class UserSettingeService {
    readonly userSettingRepoReport: UserSettingRepository;
    readonly userSettingMasterReport: UserSettingRepository;
    readonly accountRepoReport: AccountRepository;
    readonly userRepoReport: UserRepository;
    private readonly logger;
    constructor(userSettingRepoReport: UserSettingRepository, userSettingMasterReport: UserSettingRepository, accountRepoReport: AccountRepository, userRepoReport: UserRepository, logger: Logger);
    updateUserSettingByKey(key: string, body: UpdateNotificationSettingDto, userId: number): Promise<UserSettingEntity>;
    getUserSettingByKey(key: string, userId: number): Promise<UserSettingEntity>;
    updateNotificationSetting(key: string, userId: number): Promise<void>;
    getUserSettingByUserId(userId: number): Promise<{
        userNotificationSettings?: undefined;
        user?: undefined;
    } | {
        userNotificationSettings: UserSettingEntity;
        user: import("../../models/entities/user.entity").UserEntity;
    }>;
}
