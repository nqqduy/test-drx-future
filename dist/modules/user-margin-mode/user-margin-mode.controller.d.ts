import { UpdateMarginModeDto } from './dto/update-user-margin-mode.dto';
import { UserMarginModeService } from './user-margin-mode.service';
export declare class UserMarginModeController {
    private readonly userMarginModeService;
    constructor(userMarginModeService: UserMarginModeService);
    updateMarginMode(input: UpdateMarginModeDto, userId: number): Promise<{
        data: void;
    }>;
    getMarginMode(userId: number, instrumentId: number): Promise<{
        data: import("../../models/entities/user-margin-mode.entity").UserMarginModeEntity;
    }>;
}
