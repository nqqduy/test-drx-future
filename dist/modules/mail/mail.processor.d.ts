import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UpdateEmailDto } from 'src/modules/mail/dto/update-email.dto';
import { UserService } from 'src/modules/user/users.service';
import { FundingService } from '../funding/funding.service';
export declare class MailProcessor {
    private readonly mailerService;
    private readonly userService;
    private readonly fundingService;
    private readonly logger;
    static MAIL_BANNER_LINK: string;
    constructor(mailerService: MailerService, userService: UserService, fundingService: FundingService, logger: Logger);
    sendVerifyEmail({ data }: Job<UpdateEmailDto>): Promise<number>;
    sendLiquidationCall(job: Job): Promise<number>;
    sendTestMail(job: Job): Promise<number>;
    sendMailFundingFee(job: Job): Promise<number>;
    sendTriggeredMail(job: Job): Promise<number>;
    sendFundingMailAndAddToQueue(job: Job): Promise<number>;
}
