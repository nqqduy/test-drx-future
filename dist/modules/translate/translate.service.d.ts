import { I18nService } from 'nestjs-i18n';
import { UserEntity } from 'src/models/entities/user.entity';
export declare class TranslateService {
    private readonly i18n;
    constructor(i18n: I18nService);
    translate(user: UserEntity, key: string, args?: ({
        [k: string]: any;
    } | string)[] | {
        [k: string]: any;
    }): Promise<any>;
}
