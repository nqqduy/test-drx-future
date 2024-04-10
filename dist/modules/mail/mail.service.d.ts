import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { RedisService } from 'nestjs-redis';
import { UserEntity } from 'src/models/entities/user.entity';
import { LiquidationCallDto } from 'src/modules/mail/dto/liquidation-call.dto';
import { HttpService } from '@nestjs/axios';
import { CommandOutput } from '../matching-engine/matching-engine.const';
import { UserSettingeService } from '../user-setting/user-setting.service';
import { UserSettingRepository } from 'src/models/repositories/user-setting.repository';
import { TranslateService } from '../translate/translate.service';
import { UserRepository } from 'src/models/repositories/user.repository';
export declare class MailService {
    private readonly emailQueue;
    private readonly redisService;
    private cacheManager;
    private readonly httpService;
    private readonly userSettingService;
    readonly userSettingMasterReport: UserSettingRepository;
    private readonly i18n;
    private usersRepositoryMaster;
    static MAIL_DOMAIN: string;
    static MAIL_PREFIX: string;
    static MAIL_TTL: number;
    static WAIT_PREFIX: string;
    static WAIT_TTL: number;
    constructor(emailQueue: Queue, redisService: RedisService, cacheManager: Cache, httpService: HttpService, userSettingService: UserSettingeService, userSettingMasterReport: UserSettingRepository, i18n: TranslateService, usersRepositoryMaster: UserRepository);
    checkWaitTime(userId: number): Promise<string>;
    getPendingEmail(userId: UserEntity): Promise<string>;
    sendLiquidationCall(liquidationDto: LiquidationCallDto): Promise<void>;
    sendTestEmail(email: string, subject: string, content: string): Promise<void>;
    getQueueStats(): Promise<{
        activeCount: number;
        failedCount: number;
        waitingCount: number;
    }>;
    sendMailTpslStopOrder(email: string, order: any, trigger: string, exchangeLink: string, emailSupport: string, phoneSupport: string, bannerImage: string, footerImage: string): Promise<void>;
    sendMailFundingFee(email: string, fundingRate: string, symbols: string[]): Promise<void>;
    sendMailWhenTpSlOrderTriggered(command: CommandOutput): Promise<void>;
}
