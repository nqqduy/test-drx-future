import { SettingEntity } from 'src/models/entities/setting.entity';
import { SettingRepository } from 'src/models/repositories/setting.repository';
export declare class SettingService {
    readonly settingRepoReport: SettingRepository;
    readonly settingRepoMaster: SettingRepository;
    constructor(settingRepoReport: SettingRepository, settingRepoMaster: SettingRepository);
    findAll(): Promise<SettingEntity[]>;
    findBySettingKey(key: string): Promise<SettingEntity>;
    updateSettingByKey(key: string, value: string): Promise<SettingEntity>;
}
