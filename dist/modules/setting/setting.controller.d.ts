import { SettingEntity } from 'src/models/entities/setting.entity';
import { UpdateSettingDto } from 'src/modules/setting/dto/update-setting.dto';
import { SettingService } from 'src/modules/setting/setting.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
export declare class SettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    getAll(): Promise<ResponseDto<SettingEntity[]>>;
    getMinimumWithdrawal(): Promise<ResponseDto<SettingEntity>>;
    updateMinimumWithdrawal(dto: UpdateSettingDto): Promise<ResponseDto<SettingEntity>>;
    getWithdrawalFee(): Promise<ResponseDto<SettingEntity>>;
    updateWithdrawalFee(dto: UpdateSettingDto): Promise<ResponseDto<SettingEntity>>;
}
